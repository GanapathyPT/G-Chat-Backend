import { compare, genSalt, hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import { sign, verify } from "jsonwebtoken";
import { Token, TokenType } from "../models/TokenModel";
import { User, UserType } from "../models/userModel";

export interface CustomRequest extends Request {
	user: UserType;
}
interface Tokens {
	refreshToken: string;
	accessToken: string;
}
interface RegisterUserBody {
	username: string;
	email: string;
	password: string | null;
}
interface LoginUserBody {
	email: string;
	password: string;
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

// auth utilities
const createAccessToken = (user: UserType) => {
	return sign(
		{ id: user.id, username: user.username, email: user.email },
		process.env.ACCESS_TOKEN_SECRET as string,
		{ expiresIn: "1h" }
	);
};

const createRefreshToken = (user: UserType) => {
	return sign(
		{ id: user.id, username: user.username, email: user.email },
		process.env.REFRESH_TOKEN_SECRET as string,
		{ expiresIn: "30days" }
	);
};

const createTokensForUser = async (user: UserType): Promise<Tokens> => {
	const accessToken = createAccessToken(user);
	let refreshToken: string;

	const oldToken = await Token.findOne({ user: user.id });
	if (oldToken !== null) {
		oldToken.token = createRefreshToken(user);
		const { token } = await oldToken.save();
		refreshToken = token;
	} else {
		const { token } = await new Token({
			token: createRefreshToken(user),
			user,
		}).save();
		refreshToken = token;
	}

	return {
		accessToken,
		refreshToken,
	};
};

const registerNewuser = async (
	credentials: RegisterUserBody
): Promise<Tokens> => {
	const { email, password, username } = credentials;
	const user = await new User({
		username,
		email,
		password,
	}).save();

	const accessToken = createAccessToken(user);
	const refreshToken = createRefreshToken(user);

	await new Token({
		user: user,
		token: refreshToken,
	}).save();

	return {
		accessToken,
		refreshToken,
	};
};

// middlewares
const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers["authorization"] as string;
	const accessToken = token && token.split(" ")[1];

	if (accessToken !== undefined) {
		try {
			const info = await verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET as string
			);
			const user = await User.findById((info as any).id);
			(req as CustomRequest).user = user as UserType;
			return next();
		} catch {
			return res.status(403).json({
				error: "Invalid Token",
			});
		}
	}
	res.status(403).json({
		error: "token not provided",
	});
};

const validationMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json({
			errors: error.array(),
		});
	}
	next();
};

const register = async (req: Request, res: Response) => {
	const { email, password, username }: RegisterUserBody = req.body;
	if (password === null)
		return res.json({
			errors: [
				{
					param: "password",
					msg: "Password can't be empty",
				},
			],
		});

	const alreadyExists = await User.findOne({ email });
	if (alreadyExists !== null)
		return res.status(400).json({
			errors: [
				{
					param: "email",
					msg: "Email already exists",
				},
			],
		});

	const salt: string = await genSalt(10);
	const hashedPassword = await hash(password, salt);
	const { accessToken, refreshToken } = await registerNewuser({
		username,
		email,
		password: hashedPassword,
	});

	res.status(201).json({
		errors: null,
		accessToken,
		refreshToken,
	});
};

const login = async (req: Request, res: Response) => {
	const { email, password }: LoginUserBody = req.body;

	const user = await User.findOne({ email });
	if (user === null)
		return res.status(400).json({
			errors: [
				{
					param: "email",
					msg: "No User found",
				},
			],
		});
	// if password is null then only google login can be done
	if (user.password === null)
		return res.status(400).json({
			errors: [
				{
					param: "password",
					msg: "Only Google login allowed for this user",
				},
			],
		});

	const valid = await compare(password, user.password);
	if (!valid)
		return res.status(401).json({
			errors: [
				{
					param: "password",
					msg: "Incorrect password",
				},
			],
		});

	const { accessToken, refreshToken } = await createTokensForUser(user);
	return res.status(200).json({
		errors: null,
		accessToken,
		refreshToken,
	});
};

const refresh = async (req: Request, res: Response) => {
	const { refreshToken }: { refreshToken: string } = req.body;

	const token = await Token.findOne({ token: refreshToken });
	if (token === null)
		return res.status(400).json({
			error: "User logged out or deleted",
		});
	const user = await User.findById(token.user);
	if (user !== null) {
		const accessToken = createAccessToken(user);
		return res.status(200).json({
			accessToken,
		});
	}
	res.status(400).json({
		error: "User not found",
	});
};

const logout = async (req: Request, res: Response) => {
	const currentUser = (req as CustomRequest).user;
	const token = await Token.deleteOne({ user: currentUser._id });
	if (token.ok)
		return res.status(200).json({
			error: null,
			msg: "user token deleted",
		});
	return res.status(200).json({
		error: "token not deleted",
	});
};

const googleAuth = async (req: Request, res: Response) => {
	const token: string = req.body.token;

	const ticket = await googleClient.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_CLIENT_ID as string,
	});

	const payload = ticket.getPayload();
	if (payload) {
		const { email, name } = payload;
		const user = await User.findOne({ email: email });
		// login the user if user found
		if (user) {
			const { accessToken, refreshToken } = await createTokensForUser(
				user
			);
			return res.status(200).json({
				errors: null,
				accessToken,
				refreshToken,
			});
		}
		if (name && email) {
			// register a new user
			const { refreshToken, accessToken } = await registerNewuser({
				username: name,
				email,
				password: null,
			});
			return res.status(201).json({
				errors: null,
				accessToken,
				refreshToken,
			});
		}
		return res.status(400).json({
			error: "no name and password",
		});
	}
	res.status(401).json({
		error: "no payload",
	});
};

export {
	register,
	login,
	refresh,
	authMiddleware,
	validationMiddleware,
	logout,
	googleAuth,
};

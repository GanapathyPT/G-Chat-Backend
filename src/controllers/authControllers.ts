import { compare, genSalt, hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import { sign, verify } from "jsonwebtoken";
import { Token } from "../models/TokenModel";
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
	profilePic?: string;
}
interface LoginUserBody {
	email: string;
	password: string;
}

// google client instance
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

// auth utilities
/**
 * create a new access token for the user
 * @param user -> user object to create the access token
 */
const createAccessToken = (user: UserType) => {
	return sign(
		{ id: user.id, username: user.username, email: user.email },
		process.env.ACCESS_TOKEN_SECRET as string,
		{ expiresIn: "1h" }
	);
};
/**
 * create a new refresh token for the user
 * @param user -> user object to create the refresh token
 */
const createRefreshToken = (user: UserType) => {
	return sign(
		{ id: user.id, username: user.username, email: user.email },
		process.env.REFRESH_TOKEN_SECRET as string,
		{ expiresIn: "30days" }
	);
};

/**
 * helper function to create tokens for the user based on some criteria
 * @param user -> user object
 */
const createTokensForUser = async (user: UserType): Promise<Tokens> => {
	const accessToken = createAccessToken(user);
	let refreshToken: string;

	const oldToken = await Token.findOne({ user: user.id });
	if (oldToken !== null) {
		// if old token is found then replacing itwith new token
		// this is done to prevent the user from logging in with more than 1 device at a time
		// only the last logged in device login will work
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

/**
 * registering a new user (normal register and google oauth)
 * @param credentials -> details, crendentials of the user
 */
const registerNewuser = async (
	credentials: RegisterUserBody
): Promise<Tokens> => {
	const { email, password, username, profilePic } = credentials;
	const user = await new User({
		username,
		email,
		password,
		profilePic,
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

/**
 * auth middleware to check if user is logged in or not
 */
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

/**
 * validation middleware if the request has the required info
 */
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

/**
 * register a new user
 */
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

/**
 * login a user
 */
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

/**
 * refresh the access token using the refresh token
 */
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

/**
 * logout a user
 */
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

/**
 * login or register a user with googl authentication
 */
const googleAuth = async (req: Request, res: Response) => {
	const token: string = req.body.token;

	const ticket = await googleClient.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_CLIENT_ID as string,
	});

	const payload = ticket.getPayload();
	if (payload) {
		const { email, name, picture } = payload;
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
				profilePic: picture,
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

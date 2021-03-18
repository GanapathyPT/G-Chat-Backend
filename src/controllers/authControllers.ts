import { compare, genSalt, hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import { Token } from "../models/TokenModel";
import { User } from "../models/userModel";
import { CustomRequest, UserType } from "../types/authTypes";

// auth utilities
const createAccessToken = (user: UserType) => {
	return sign(
		{ _id: user._id, username: user.username, email: user.email },
		process.env.ACCESS_TOKEN_SECRET as string,
		{ expiresIn: "1h" }
	);
};

const createRefreshToken = (user: UserType) => {
	return sign(
		{ _id: user._id, username: user.username, email: user.email },
		process.env.REFRESH_TOKEN_SECRET as string
	);
};

// middlewares
const authMiddleware = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers["authorization"] as string;
	const accessToken = token && token.split(" ")[1];

	if (accessToken !== undefined) {
		try {
			const user = await verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET as string
			);
			req.user = user as UserType;
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
	try {
		const {
			email,
			password,
			username,
		}: {
			email: string;
			password: string;
			username: string;
		} = req.body;

		const alreadyExists = await User.findOne({ email });
		if (alreadyExists !== null)
			return res.status(400).json({
				errors: [
					{
						param: "email",
						msg: "Email alrady exists",
					},
				],
			});

		const salt: string = await genSalt(10);
		const hashedPassword = await hash(password, salt);
		const user: UserType = await new User({
			username,
			email,
			password: hashedPassword,
		}).save();

		const accessToken = createAccessToken(user);
		const refreshToken = createRefreshToken(user);

		await new Token({
			user: user,
			token: refreshToken,
		}).save();

		res.status(201).json({
			errors: null,
			accessToken,
			refreshToken,
		});
	} catch {
		res.status(500).json({
			errors: null,
		});
	}
};

const login = async (req: Request, res: Response) => {
	try {
		const {
			email,
			password,
		}: {
			email: string;
			password: string;
		} = req.body;

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

		const valid = await compare(password, user.password as string);
		if (!valid)
			return res.status(401).json({
				errors: [
					{
						param: "password",
						msg: "Incorrect password",
					},
				],
			});

		const accessToken = createAccessToken(user);
		let refreshToken: string;

		const oldToken = await Token.findOne({ user: user._id });
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

		return res.status(200).json({
			errors: null,
			accessToken,
			refreshToken,
		});
	} catch {
		res.status(500).json({
			errors: null,
		});
	}
};

const refresh = async (req: Request, res: Response) => {
	try {
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
	} catch {
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

const logout = async (req: Request, res: Response) => {
	const currentUser = (req as CustomRequest).user;
	if (currentUser) {
		const token = await Token.deleteOne({ user: currentUser._id });
		if (token.ok)
			return res.status(200).json({
				error: null,
				msg: "user token deleted",
			});
		return res.status(200).json({
			error: "token not deleted",
		});
	}
	res.status(402).json({
		error: "auth failed",
	});
};

export {
	register,
	login,
	refresh,
	authMiddleware,
	validationMiddleware,
	logout,
};

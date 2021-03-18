import { Router } from "express";
import { body } from "express-validator";
import {
	authMiddleware,
	login,
	refresh,
	register,
	validationMiddleware,
	logout,
} from "../controllers/authControllers";

const authRouter = Router();

authRouter.post(
	"/register",
	// validations
	body("username").isAlpha().isLength({ max: 50, min: 4 }),
	body("email").isEmail(),
	body("password").isStrongPassword({
		minLength: 3,
		minSymbols: 0,
		minNumbers: 0,
	}),
	validationMiddleware,
	register
);

authRouter.post(
	"/login",
	// validations
	body("email").isEmail(),
	body("password").isStrongPassword({
		minLength: 3,
		minSymbols: 0,
		minNumbers: 0,
	}),
	validationMiddleware,
	login
);

authRouter.post(
	"/refresh",
	// validation
	body("refreshToken").notEmpty(),
	validationMiddleware,
	refresh
);

authRouter.get("/logout", authMiddleware, logout);

export { authRouter };

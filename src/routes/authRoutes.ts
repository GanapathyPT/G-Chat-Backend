import { Router } from "express";
import { body } from "express-validator";
import {
	authMiddleware,
	login,
	refresh,
	register,
	validationMiddleware,
	logout,
	googleAuth,
} from "../controllers/authControllers";
import { tryExecute } from "../controllers/userController";

const authRouter = Router();

authRouter.post(
	"/register",
	// validations
	body("username").isLength({ max: 50, min: 4 }),
	body("email").isEmail(),
	body("password").isStrongPassword({
		minLength: 3,
		minSymbols: 0,
		minNumbers: 0,
	}),
	validationMiddleware,
	tryExecute(register)
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
	tryExecute(login)
);
authRouter.post(
	"/refresh",
	// validation
	body("refreshToken").notEmpty(),
	validationMiddleware,
	tryExecute(refresh)
);
authRouter.get("/logout", authMiddleware, logout);
authRouter.post("/googleAuth", googleAuth);

export { authRouter };

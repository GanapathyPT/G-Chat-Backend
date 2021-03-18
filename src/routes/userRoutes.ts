import { Router } from "express";
import { body } from "express-validator";
import {
	authMiddleware,
	validationMiddleware,
} from "../controllers/authControllers";
import {
	addFriend,
	getFriends,
	getUser,
	listUsers,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/list", authMiddleware, listUsers);

userRouter.get("/get-user", authMiddleware, getUser);

userRouter.get("/friends", authMiddleware, getFriends);

userRouter.post(
	"/add-friend",
	authMiddleware,
	body("newFriend").isString(),
	validationMiddleware,
	addFriend
);

export { userRouter };

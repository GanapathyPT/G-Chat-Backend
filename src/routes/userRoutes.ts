import { Router } from "express";
import { body } from "express-validator";
import {
	authMiddleware,
	validationMiddleware,
} from "../controllers/authControllers";
import {
	createRoom,
	getAllRooms,
	getUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/get-user", authMiddleware, getUser);
userRouter.get("/rooms", authMiddleware, getAllRooms);
userRouter.post(
	"/create-room",
	authMiddleware,
	body("newFriend").isString(),
	validationMiddleware,
	createRoom
);

export { userRouter };

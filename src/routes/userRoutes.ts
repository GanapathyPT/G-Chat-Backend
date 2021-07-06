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
	tryExecute,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/get-user", authMiddleware, tryExecute(getUser));
userRouter.get("/rooms", authMiddleware, tryExecute(getAllRooms));
userRouter.post(
	"/create-room",
	authMiddleware,
	body("newFriend").isString(),
	validationMiddleware,
	tryExecute(createRoom)
);

export { userRouter };

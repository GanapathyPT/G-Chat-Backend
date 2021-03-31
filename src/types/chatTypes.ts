import { Document, ObjectId } from "mongoose";
import { Socket } from "socket.io";
import { UserType } from "./authTypes";

export interface MessageType extends Document {
	author: ObjectId | UserType;
	message: string;
	timestamp: Date;
}

export interface RoomType extends Document {
	users: [ObjectId | UserType];
	messages: [ObjectId | MessageType];
	name: string;
}

export interface CustomSocket extends Socket {
	userId: ObjectId;
}

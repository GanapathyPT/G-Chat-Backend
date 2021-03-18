import { Document, ObjectId } from "mongoose";
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

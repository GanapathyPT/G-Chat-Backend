import { Request } from "express";
import { Document, ObjectId } from "mongoose";
import { RoomType } from "./chatTypes";

export interface UserType extends Document {
	_id: ObjectId;
	email: string;
	username: string;
	password?: string | null;
	friends?: [
		{
			userId: ObjectId;
			roomId: ObjectId;
		}
	];
	online: boolean;
}

export interface RelationType extends Document {
	_id: ObjectId;
	user: ObjectId | UserType;
	friend: ObjectId | UserType;
	room: ObjectId | RoomType;
}

export interface TokenType extends Document {
	user: ObjectId;
	token: string;
}

export interface CustomRequest extends Request {
	user?: UserType;
}

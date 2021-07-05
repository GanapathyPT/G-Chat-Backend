import { Model, model, Schema, Document } from "mongoose";
import { UserType } from "./userModel";

export interface MessageType {
	author: Schema.Types.ObjectId | UserType;
	message: string;
	createdAt: Date;
}

export interface RoomType extends Document {
	_id: Schema.Types.ObjectId;
	name?: string;
	users: (Schema.Types.ObjectId | UserType)[];
	messages: (Schema.Types.ObjectId | MessageType)[];
	isPersonal: boolean;
}

const MessageSchema = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 60 * 24, // 1 day in seconds
	},
});

const RoomSchema = new Schema({
	name: String,
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	messages: [MessageSchema],
	isPersonal: {
		type: Boolean,
		default: true,
	},
});

export const Room: Model<RoomType> = model("Room", RoomSchema);

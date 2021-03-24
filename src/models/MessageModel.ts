import { Model, model, Schema, Types } from "mongoose";
import { MessageType } from "../types/chatTypes";

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
	timestamp: {
		type: Date,
		default: Date.now,
	},
	expires: {
		type: Date,
		default: Date.now,
		expires: 60 * 60 * 24, // 1 day in seconds
	},
});

export const Message: Model<MessageType> = model("Message", MessageSchema);

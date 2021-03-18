import { Model, model, Schema } from "mongoose";
import { RoomType } from "../types/chatTypes";

const RoomSchema = new Schema({
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: "Message",
		},
	],
	name: {
		type: String,
	},
});

export const Room: Model<RoomType> = model("Room", RoomSchema);

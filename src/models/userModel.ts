import { Model, model, Schema } from "mongoose";
import { RelationType, UserType } from "../types/authTypes";

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		max: 250,
	},
	email: {
		type: String,
		required: true,
		max: 250,
	},
	password: {
		type: String,
		required: true,
	},
	friends: [
		{
			userId: {
				type: Schema.Types.ObjectId,
				ref: "User",
			},
			roomId: {
				type: Schema.Types.ObjectId,
				ref: "Room",
			},
		},
	],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

UserSchema.index({ username: "text", email: "text" });
export const User: Model<UserType> = model("User", UserSchema);

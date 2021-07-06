import { Model, model, Schema, Document } from "mongoose";

export interface UserType extends Document {
	_id: Schema.Types.ObjectId;
	username: string;
	email: string;
	password: string | null;
	profilePic?: string;
	rooms: Schema.Types.ObjectId[];
	online: boolean;
	createdAt: Date;
}

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		index: true,
		max: 250,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		max: 250,
	},
	password: String,
	profilePic: String,
	rooms: [
		{
			type: Schema.Types.ObjectId,
			ref: "Room",
		},
	],
	online: {
		type: Boolean,
		default: false,
	},
});

export const User: Model<UserType> = model("User", UserSchema);

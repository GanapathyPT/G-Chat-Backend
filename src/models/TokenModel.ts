import { Model, model, Schema, Types } from "mongoose";
import { TokenType } from "../types/authTypes";

const TokenSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
});

export const Token: Model<TokenType> = model("Token", TokenSchema);

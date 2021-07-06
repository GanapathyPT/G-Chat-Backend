import { Model, model, Schema, Document } from "mongoose";

export interface TokenType extends Document {
	_id: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	token: string;
}

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

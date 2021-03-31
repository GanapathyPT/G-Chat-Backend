import { ObjectId } from "mongoose";
import { Server, Socket } from "socket.io";
import { Message } from "../models/MessageModel";
import { Room } from "../models/RoomModel";
import { User } from "../models/userModel";
import { UserType } from "../types/authTypes";
import { CustomSocket } from "../types/chatTypes";

const makeUserOnline = (user: UserType) => {
	user.online = true;
	user.save();
};

const makeUserOffline = (user: UserType) => {
	user.online = false;
	user.save();
};

/**
 * get last day message for the room (if exists else created) and connect to the room
 * @param socket -> socket to emit the events
 * @param roomId -> room id for which to get the messages
 * @param userId -> current uuser id
 */
const getMessages = async (
	socket: Socket,
	roomId: ObjectId,
	userId: ObjectId
) => {
	const user = await User.findById(userId);
	if (user !== null) {
		(socket as CustomSocket).userId = user._id;
		makeUserOnline(user);

		const room = await Room.findById(roomId);
		if (room) {
			socket.join(room.name);

			const messagesId = room.messages;
			const messages = await Message.find({
				_id: {
					$in: messagesId,
				},
			});
			return socket.emit("oldMessages", {
				messages: messages.sort(
					(a, b) => a.timestamp.getTime() - b.timestamp.getTime()
				),
			});
		}
		return socket.emit("alert", {
			type: "error",
			msg: "room not found",
		});
	}
};

/**
 * add new message to the db and send the same to all the users inthe room
 * @param io -> io object
 * @param socket -> socket object
 * @param roomId -> room to send the message
 * @param author -> author of the message
 * @param message -> original message text
 */
const addNewMessage = async ({
	io,
	socket,
	roomId,
	author,
	message,
	timestamp,
}: {
	io: Server;
	socket: Socket;
	roomId: ObjectId;
	author: ObjectId;
	message: string;
	timestamp: Date;
}) => {
	// creating a new message
	const newMessage = await new Message({
		author,
		message,
		timestamp,
	}).save();

	// add the message to the room
	const room = await Room.findById(roomId);
	if (room) {
		room.messages.push(newMessage);
		await room.save();
		return io.to(room.name).emit("newMessage", { newMessage });
	}
	return socket.emit("alert", {
		type: "error",
		msg: "Can't send message",
	});
};

/**
 * handling disconnect of the user
 * @param socket -> socket of the disconnected user
 */
const disconnect = async (socket: Socket) => {
	const userId = (socket as CustomSocket).userId;

	const user = await User.findById(userId);
	if (user) makeUserOffline(user);
};

export { getMessages, addNewMessage, disconnect };

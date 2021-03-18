import { ObjectId } from "mongoose";
import { Server, Socket } from "socket.io";
import { Message } from "../models/MessageModel";
import { Room } from "../models/RoomModel";

/**
 * get last day message for the room (if exists else created) and connect to the room
 * @param user1 => first user id
 * @param user2 => second user id
 */
const getMessages = async (socket: Socket, roomId: ObjectId) => {
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
};

/**
 * add new message to the db and send the same to all the users inthe room
 * @param io -> io object
 * @param socket -> socket object
 * @roomId -> room to send the message
 * @author -> author of the message
 * @message -> original message text
 */
const addNewMessage = async ({
	io,
	socket,
	roomId,
	author,
	message,
}: {
	io: Server;
	socket: Socket;
	roomId: ObjectId;
	author: ObjectId;
	message: string;
}) => {
	// creating a new message
	const newMessage = await new Message({
		author,
		message,
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

export { getMessages, addNewMessage };

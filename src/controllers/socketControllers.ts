import { verify } from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { Server, Socket } from "socket.io";
import { Room } from "../models/RoomModel";
import { User, UserType } from "../models/userModel";
import { extractUserInfo } from "./userController";

interface NewMessage {
	roomId: ObjectId;
	message: string;
	createdAt: Date;
}

interface Handler {
	socket: Socket;
	io: Server;
}

interface CustomSocket extends Socket {
	user: UserType;
}

enum SocketEmitTypes {
	NEW_MESSAGE = "NEW_MESSAGE",
	ALERT = "ALERT",
}

enum SocketListenerTypes {
	SEND_MESSAGE = "SEND_MESSAGE",
	DISCONNECT = "disconnect",
}

const makeUserOnline = (user: UserType) => {
	user.online = true;
	user.save();
};

const makeUserOffline = (user: UserType) => {
	user.online = false;
	user.save();
};

/**
 * add new message to the db and send the same to all the users in the room
 * @param io -> io object
 * @param socket -> socket object
 * @param roomId -> room to send the message
 * @param message -> original message text
 */
const addNewMessage = async ({
	io,
	socket,
	roomId,
	message,
	createdAt,
}: Handler & NewMessage) => {
	const currentUser = (socket as CustomSocket).user;

	// add the message to the room
	const room = await Room.findById(roomId);
	if (room) {
		room.messages.push({
			author: currentUser._id,
			message,
			createdAt,
		});
		await room.save();
		socket.join(room.id);
		return io.to(room.id).emit(SocketEmitTypes.NEW_MESSAGE, {
			author: extractUserInfo(currentUser),
			message,
			createdAt,
		});
	}
	console.log("got new message but room not found");
	return socket.emit(SocketEmitTypes.ALERT, {
		type: "error",
		msg: "Can't send message",
	});
};

/**
 * handling disconnect of the user
 * @param socket -> socket of the disconnected user
 */
const disconnect = async (socket: Socket) => {
	const user = (socket as CustomSocket).user;
	makeUserOffline(user);
};

function socketController(socket: Socket, io: Server) {
	const user = (socket as CustomSocket).user;
	console.log(user.username, "connected");
	makeUserOnline(user);

	socket.on(SocketListenerTypes.SEND_MESSAGE, (newMessage: NewMessage) =>
		addNewMessage({
			io,
			socket,
			...newMessage,
		})
	);

	socket.on(SocketListenerTypes.DISCONNECT, () => disconnect(socket));
}

async function socketAuthMiddleware(
	socket: Socket,
	next: (err?: Error | undefined) => void
) {
	if (socket.handshake.query && socket.handshake.query.token) {
		const accessToken = socket.handshake.query.token as string;
		try {
			const info = await verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET as string
			);
			const user = await User.findById((info as any).id);
			(socket as CustomSocket).user = user as UserType;
			next();
		} catch {
			console.error("auth failed");
			next(new Error("Authentication failed"));
		}
	} else {
		console.error("auth: no token found");
		next(new Error("Authentication failed"));
	}
}

export { socketController, socketAuthMiddleware };

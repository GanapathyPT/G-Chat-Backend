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
	USER_ONLINE = "USER_ONLINE",
	USER_OFFLINE = "USER_OFFLINE",
}

enum SocketListenerTypes {
	SEND_MESSAGE = "SEND_MESSAGE",
	DISCONNECT = "disconnect",
}

/**
 * save user as online and emit the same to all users
 * @param user -> user object
 * @param io -> io to emit the event
 */
const makeUserOnline = async (user: UserType, io: Server) => {
	io.emit(SocketEmitTypes.USER_ONLINE, user.id);
	console.log("user online", user.username);
	user.online = true;
	await user.save();
};

/**
 * save user as offline and emit the same to all users
 * @param user -> user object
 * @param io -> io to emit the event
 */
const makeUserOffline = async (user: UserType, io: Server) => {
	io.emit(SocketEmitTypes.USER_OFFLINE, user.id);
	console.log("user offline", user.username);
	user.online = false;
	await user.save();
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
	return socket.emit(SocketEmitTypes.ALERT, {
		type: "error",
		msg: "Can't send message",
	});
};

/**
 * handling disconnect of the user
 * @param socket -> socket of the disconnected user
 */
const disconnect = async (socket: Socket, io: Server) => {
	const user = (socket as CustomSocket).user;
	await makeUserOffline(user, io);
};

/**
 * controller to handle events on sockt connection
 * @param socket -> socket of the current user
 * @param io -> global i0 server object
 */
function socketController(socket: Socket, io: Server) {
	// when a user connects make him as online
	const user = (socket as CustomSocket).user;
	makeUserOnline(user, io);

	socket.on(SocketListenerTypes.SEND_MESSAGE, (newMessage: NewMessage) =>
		addNewMessage({
			io,
			socket,
			...newMessage,
		})
	);

	socket.on(SocketListenerTypes.DISCONNECT, () => disconnect(socket, io));
}

/**
 * middleware to check if the socket connection emmited is from an authenticated source\
 * @param socket -> socket of connecting user
 * @param next -> neext function that needed to be executed
 */
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
			next(new Error("Authentication failed"));
		}
	} else {
		next(new Error("Authentication failed"));
	}
}

export { socketController, socketAuthMiddleware };

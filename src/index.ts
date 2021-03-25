import { config } from "dotenv";
import express, { json } from "express";
import { createServer } from "http";
import { connect, ObjectId } from "mongoose";
import { Server, Socket } from "socket.io";
import { addNewMessage, getMessages } from "./controllers/socketControllers";
import { authRouter } from "./routes/authRoutes";
import { userRouter } from "./routes/userRoutes";
import cors from "cors";

// registering models for neglecting errors
import { User } from "./models/userModel";
import { Token } from "./models/TokenModel";
import { Message } from "./models/MessageModel";
import { Room } from "./models/RoomModel";

// loading the env varibles
config();
// loading server and conncting db
const expressApp = express();
const server = createServer(expressApp);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});
const PORT = process.env.PORT as string;
connect(
	process.env.MONGODB_URL as string,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) console.error(err.message);
		else console.log("database connected");
	}
);

// socket connections
io.on("connection", (socket: Socket) => {
	socket.on("getMessages", ({ roomId }: { roomId: ObjectId }) =>
		getMessages(socket, roomId)
	);

	socket.on(
		"sendMessage",
		(newMessage: {
			roomId: ObjectId;
			author: ObjectId;
			message: string;
			time: string;
		}) =>
			addNewMessage({
				io,
				socket,
				roomId: newMessage.roomId,
				author: newMessage.author,
				message: newMessage.message,
				timestamp: new Date(newMessage.time),
			})
	);

	socket.on("disconnect", () => {
		console.log("user left");
	});
});

// using express body parser
expressApp.use(json());
expressApp.use(
	cors({
		origin: "https://g-chat-messenger.netlify.app",
	})
);

// registering all the routes
expressApp.use("/api/auth", authRouter);
expressApp.use("/api/user", userRouter);

// sending frontend files
expressApp.use("/", express.static("public"));

server.listen(PORT, () => {
	console.log(`Server Started at Port, ${PORT}`);
});

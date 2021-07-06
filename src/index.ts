import { config } from "dotenv";
import express, { json } from "express";
import { createServer } from "http";
import { connect } from "mongoose";
import { Server, Socket } from "socket.io";
import { authRouter } from "./routes/authRoutes";
import { userRouter } from "./routes/userRoutes";
import cors from "cors";
import {
	socketAuthMiddleware,
	socketController,
} from "./controllers/socketControllers";

// loading the env variables
config();
// loading server and connecting db
const expressApp = express();
const server = createServer(expressApp);
const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL,
	},
});
const PORT = process.env.PORT as string;
connect(
	process.env.MONGODB_URL as string,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	(err) => {
		if (err) console.error(err.message);
		else console.log("database connected");
	}
);

// socket connections
io.use(socketAuthMiddleware);
io.on("connection", (socket: Socket) => socketController(socket, io));

// using express body parser
expressApp.use(json());
expressApp.use(
	cors({
		origin: process.env.FRONTEND_URL,
	})
);

// registering all the routes
expressApp.use("/api/auth", authRouter);
expressApp.use("/api/user", userRouter);

server.listen(PORT, () => {
	console.log(`Server Started at Port, ${PORT}`);
});

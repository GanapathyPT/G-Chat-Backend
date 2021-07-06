import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { MessageType, Room, RoomType } from "../models/RoomModel";
import { User, UserType } from "../models/userModel";
import { CustomRequest } from "./authControllers";

const getRoomName = (room: RoomType, currentUser: UserType) => {
	if (room.isPersonal && room.users.length === 2) {
		const friend =
			(room.users[0] as UserType).id === currentUser.id
				? room.users[1]
				: room.users[0];
		return (friend as UserType).username;
	}

	return room.name;
};
const getRoomUsers = (room: RoomType) =>
	(room.users as UserType[]).map(extractUserInfo);
const sortMessages = (messages: MessageType[]) =>
	messages.sort(
		(msg1, msg2) => msg1.createdAt.getTime() - msg2.createdAt.getTime()
	);

export const extractUserInfo = (user: UserType) => ({
	id: user.id,
	username: user.username,
	email: user.email,
	profilePic: user.profilePic,
	online: user.online,
});

const extractRoomInfo = (room: RoomType, currentUser: UserType) => ({
	id: room.id,
	name: getRoomName(room, currentUser),
	users: getRoomUsers(room),
	messages: sortMessages(room.messages as MessageType[]),
	isPersonal: room.isPersonal,
});

export const getAllRooms = async (req: Request, res: Response) => {
	const currentUser = (req as CustomRequest).user;
	const rooms = await Room.find({
		_id: {
			$in: currentUser.rooms,
		},
	})
		.populate("users")
		.populate("messages");

	res.status(200).json({
		result: rooms.map((room) => extractRoomInfo(room, currentUser)),
	});
};

export const getUser = async (req: Request, res: Response) => {
	const currentUser = (req as CustomRequest).user;

	const searchParam = req.query.q;
	if (searchParam) {
		const users = await User.find({
			$or: [
				{
					username: {
						$regex: searchParam as string,
						$options: "i",
					},
				},
			],
		});
		return res.json({
			result: users
				.filter((user) => user.id !== currentUser.id)
				.map(extractUserInfo),
		});
	}
	res.json({
		error: "No param provided",
		result: [],
	});
};

export const createRoom = async (req: Request, res: Response) => {
	const currentUser = (req as CustomRequest).user;
	const { newFriend }: { newFriend: ObjectId } = req.body;

	const friendUser = await User.findById(newFriend);
	if (friendUser) {
		// creating a new Room for the user and his newFriend
		const room = await new Room({
			messages: [],
			users: [currentUser._id, friendUser._id],
			isPersonal: true,
		}).save();

		currentUser.rooms.push(room._id);
		await currentUser.save();

		friendUser.rooms.push(room._id);
		await friendUser.save();

		return res.status(200).json({
			result: extractRoomInfo(room, currentUser),
		});
	}
	return res.status(400).json({
		error: "User Can't be found",
	});
};

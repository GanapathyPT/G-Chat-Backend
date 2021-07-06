import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { MessageType, Room, RoomType } from "../models/RoomModel";
import { User, UserType } from "../models/userModel";
import { CustomRequest } from "./authControllers";

/**
 * try to execute the given callback controller and if any error found log it
 * @param callback -> controller callback
 */
export const tryExecute =
	(callback: (req: Request, res: Response) => void) =>
	(req: Request, res: Response) => {
		try {
			callback(req, res);
		} catch (error) {
			console.error(error);
		}
	};

/**
 * get the room name based on the room type (personal or group)
 * @param room -> room object
 * @param currentUser -> current user who makes the request
 */
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
/**
 * get the users of a room as an extracted info
 * @param room -> room object
 */
const getRoomUsers = (room: RoomType) =>
	(room.users as UserType[]).map(extractUserInfo);
/**
 * sort all the message with the help of createdAt timestamp
 * @param messages -> messages to sort
 */
const sortMessages = (messages: MessageType[]) =>
	messages.sort(
		(msg1, msg2) => msg1.createdAt.getTime() - msg2.createdAt.getTime()
	);

/**
 * helper function to get the required info of a user
 * @param user -> useer object
 */
export const extractUserInfo = (user: UserType) => ({
	id: user.id,
	username: user.username,
	email: user.email,
	profilePic: user.profilePic,
	online: user.online,
});

/**
 * helper function to get the required info of a room
 * @param room -> room object
 * @param currentUser -> current user who makes the request
 */
const extractRoomInfo = (room: RoomType, currentUser: UserType) => ({
	id: room.id,
	name: getRoomName(room, currentUser),
	users: getRoomUsers(room),
	messages: sortMessages(room.messages as MessageType[]),
	isPersonal: room.isPersonal,
});

/**
 * get all the rooms of the current user
 */
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

/**
 * get all the users maching the search query
 */
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

/**
 * create a new room (both for pc and groups)
 * 	-- groups not yet implemented
 */
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

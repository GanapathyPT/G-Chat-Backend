import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { Room } from "../models/RoomModel";
import { User } from "../models/userModel";
import { CustomRequest } from "../types/authTypes";

const listUsers = async (req: Request, res: Response) => {
	const usersList = await User.find();
	res.json({
		result: usersList,
	});
};

const getFriends = async (req: Request, res: Response) => {
	const currentUser = (req as CustomRequest).user;

	const user = await User.findById(currentUser?._id);
	if (user) {
		const friends = await User.find({
			_id: {
				$in: user.friends?.map((friend) => friend.userId),
			},
		});
		return res.status(200).json({
			result: friends.map((friend, index) => ({
				_id: friend._id,
				email: friend.email,
				username: friend.username,
				roomId: user.friends && user.friends[index].roomId,
			})),
		});
	}
	res.status(400).json({
		error: "no friends found",
		result: [],
	});
};

const getUser = async (req: Request, res: Response) => {
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
				{
					email: {
						$regex: searchParam as string,
						$options: "i",
					},
				},
			],
		});
		return res.json({
			result: users
				.filter((user) => user._id !== currentUser?._id)
				.map((user) => ({
					_id: user._id,
					username: user.username,
					email: user.email,
				})),
		});
	}
	res.json({
		error: "No param provided",
		result: [],
	});
};

const addFriend = async (req: Request, res: Response) => {
	const currentUser = (req as CustomRequest).user;
	const { newFriend }: { newFriend: ObjectId } = req.body;

	if (currentUser) {
		const user = await User.findById(currentUser._id);
		const friend = await User.findById(newFriend);
		if (user && friend) {
			// creating a new Room for the user and his newFriend
			const room = await new Room({
				users: [user._id, friend._id],
				messages: [],
				name: `${user.username}__${friend.username}`,
			}).save();

			user.friends?.push({ userId: friend._id, roomId: room._id });
			await user.save();

			friend.friends?.push({ userId: user._id, roomId: room._id });
			await friend.save();

			return res.status(200).json({
				result: {
					_id: friend._id,
					email: friend.email,
					username: friend.username,
					roomId: room._id,
				},
			});
		}
		return res.status(400).json({
			error: "User Can't be found",
		});
	}
	res.status(401).json({
		error: "user not authorized",
	});
};

export { listUsers, getUser, getFriends, addFriend };

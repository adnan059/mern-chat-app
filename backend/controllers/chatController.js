const Chat = require("../models/chat");
const User = require("../models/user");
const createError = require("../utils/Error");

const accessChat = async (req, res, next) => {
  const { userId } = req.body;

  //console.log(req.user._id);
  //console.log(userId);

  if (!userId) {
    return next(createError(400, "userId not sent with the request!"));
  }

  if (userId == req.user._id) {
    return next(createError(400, "You cannot chat with yourself!"));
  }

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.status(200).json(isChat[0]);
    } else {
      const newChat = new Chat({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });

      const savedChat = await newChat.save();

      const fullChat = await Chat.findOne({ _id: savedChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(fullChat);
    }
  } catch (error) {
    next(error);
  }
};

const fetchChats = async (req, res, next) => {
  try {
    let chats = await Chat.find({ users: { $in: req.user._id } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

const createGroupChat = async (req, res, next) => {
  //console.log(req.body.chatName);
  if (!req.body.users || !req.body.chatName) {
    return next(createError(400, "Please fill all the fields"));
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return next(
      createError(400, "More than 2 users are required to form a group chat")
    );
  }

  users.push(req.user);

  try {
    const newGC = new Chat({
      chatName: req.body.chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const groupChat = await newGC.save();

    const gcFinal = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(gcFinal);
  } catch (error) {
    next(error);
  }
};

const renameGroup = async (req, res, next) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return next(createError(404, "Chat not found!"));
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (error) {
    next(error);
  }
};

const addToGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return next(createError(404, "Chat not found!"));
    } else {
      res.status(200).json(added);
    }
  } catch (error) {
    next(error);
  }
};

const removeFromGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;
  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return next(createError(404, "Chat not found!"));
    } else {
      res.status(200).json(removed);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};

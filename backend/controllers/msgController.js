const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");
const createError = require("../utils/Error");

const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return next(createError(400, "Invalid data passed into the request!"));
  }

  try {
    const newMsg = new Message({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    const savedMsg = await newMsg.save();

    let msg = await Message.findOne({ _id: savedMsg._id })
      .populate("sender", "name pic")
      .populate("chat");

    msg = await User.populate(msg, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: msg }, { new: true });

    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
};

const allMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  allMessages,
};

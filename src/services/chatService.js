const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Chat = require('../models/Message');

/**
 * Get all chat
 * @returns array of object
 */
const getAllChat = async () => {
  const chat = await Chat.findAll();

  return chat;
};

/**
 * Get list chat
 * @param {uuidv4} sender
 * @param {uuidv4} receiver
 * @returns array of object
 */
const getOwnChat = async (sender, receiver, opts = {}) => {
  const chat = await Chat.findAll(
    {
      where: {
        sender,
        receiver,
      },
      ...opts,
    },
  );

  return chat;
};

/**
 * Create message / sending message
 * @param {uuidv4} sender
 * @param {uuidv4} receiver
 * @param {string} message
 * @returns object
 */
const createChat = async (sender, receiver, message) => {
  const data = {
    sender,
    receiver,
    message,
  };

  const chat = await Chat.create(data);

  return chat;
};

module.exports = {
  getAllChat,
  getOwnChat,
  createChat,
};

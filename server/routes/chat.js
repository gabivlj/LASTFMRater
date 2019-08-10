const router = require('express').Router();
const passport = require('passport');
const handleError = require('../lib/handleError');
const Chat = require('../models/Chat');
const dontCareWaitingForSave = require('../lib/dontCareWaitingForSave');

/**
 * @description Route for getting all the chats of an user.
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.user;
    const [err, chats] = await handleError(
      Chat.find({
        [`users.${id}.id`]: id
      })
    );
    if (err) {
      return res.status(404).json({ error: 'Error retrieving chats.' });
    }
    return res.json({ chats });
  }
);

/**
 * @description Route for adding a message to a chat, if it doesn't exists, it creates it.
 */
router.post(
  '/new',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { text, from, to } = req.body;
    const userIdFrom = from._id;
    const userIdTo = to._id;
    const [err, chat] = await handleError(
      Chat.findOne({
        [`users.${userIdFrom}.id`]: userIdFrom,
        [`users.${userIdTo}.id`]: userIdTo
      })
    );
    if (err) {
      return res.status(404).json({ error: 'Error posting message.' });
    }
    if (!chat) {
      const Ch = new Chat({
        users: {
          [userIdFrom]: { id: userIdFrom, username: from.username },
          [userIdTo]: { id: userIdTo, username: to.username }
        },
        messages: [{ text, user: userIdFrom, username: from.username }]
      });
      const newChat = await Ch.save();
      return res.json({ chat: newChat });
    }
    const msgs = [
      ...chat.messages,
      { text, user: userIdFrom, username: from.username }
    ];
    chat.messages = msgs;
    dontCareWaitingForSave(chat, true);
    return res.json({ chat });
  }
);

/**
 * @description Route for getting the chat between 2 users. Returns null and a message if it doesn't exist.
 */
router.get(
  '/:otherUserId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.user;
    const { otherUserId } = req.params;
    const [err, chat] = await handleError(
      Chat.findOne({
        [`users.${id}.id`]: id,
        [`users.${otherUserId}.id`]: otherUserId
      })
    );
    if (err) {
      console.log(err);
      return res.status(404).json({ error: 'Error finding chat.' });
    }
    if (!chat) {
      return res.status(201).json({
        chat: null,
        message: 'Empty chat, send a message to start chatting!'
      });
    }
    return res.json({ chat });
  }
);

/**
 * @description Route for getting the chat. Returns chat: null and a message if it doesn't exist.
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.user;
    const [err, chat] = await handleError(
      Chat.findOne({
        [`users.${id}.id`]: id,
        _id: req.params.id
      })
    );
    if (err) {
      console.log(err);
      return res.status(404).json({ error: 'Error finding chat.' });
    }
    if (!chat) {
      return res.status(201).json({
        chat: null,
        message: 'Empty chat, send a message to start chatting!'
      });
    }
    return res.json({ chat });
  }
);

module.exports = router;

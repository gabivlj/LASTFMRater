const router = require('express').Router();
const passport = require('passport');
const handleError = require('../lib/handleError');
const Chat = require('../models/Chat');
const dontCareWaitingForSave = require('../lib/dontCareWaitingForSave');

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
        messages: [{ text, user: userIdFrom }]
      });
      const newChat = await Ch.save();
      return res.json({ chat: newChat });
    }
    const msgs = [...chat.messages, { text, user: userIdFrom }];
    chat.messages = msgs;
    dontCareWaitingForSave(chat, true);
    return res.json({ chat });
  }
);

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
    return res.json({ chat });
  }
);

module.exports = router;

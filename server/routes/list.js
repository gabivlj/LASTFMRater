const router = require('express').Router();
const passport = require('passport');
const List = require('../models/List');
const handleError = require('../lib/handleError');
const checkValidID = require('../lib/checkValidID');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {},
);

/**
 * @PUT
 * @param {String || mongoose.Types.ObjectId} itemID
 * @param {String} type
 * @description Adds a new item to a given list
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.params;
    const [err, list] = await handleError(List.findById(id));
    if (err || !list) {
      return res
        .status(404)
        .json({ error: 'Error finding list with the given ID.' });
    }
    const { body } = req;
    const { itemID, type = '' } = body;
    const isValid = await checkValidID(itemID, type === '' ? list.model : type);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: 'Invalid ID for the specified type.' });
    }
    list.ids.push(itemID);
    return list
      .save()
      .then(listSaved => {
        return res.json({ list: listSaved });
      })
      .catch(err => {
        console.log(err);
        return res.status(400).json({ error: 'Error saving list.' });
      });
  },
);

router.get('/:id', (req, res) => {});

module.exports = router;

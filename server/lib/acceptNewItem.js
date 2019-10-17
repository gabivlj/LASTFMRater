const Album = require('../models/Album');
const Artist = require('../models/Artist');
const handleError = require('./handleError');
const remove = require('./remove');
const parse = require('./parse');
const createOpinionObject = require('./createOpinionObject');

// TESTING.
const time = () => {
  const startTime = new Date();
  return s => {
    console.log(new Date() - startTime);
    return time();
  };
};

const AVAILABLE_UPDATES = {
  artist: {
    grampyAccount: element => typeof element === 'string',
    name: element => typeof element === 'string',
    description: element => typeof element === 'string',
    images: element => Array.isArray(element),
    dateOfBirth: element => typeof element === 'string',
    genres: element => Array.isArray(element),
    networks: element => typeof element === 'object',
  },
};

async function findAndProcess(_id, Model) {
  const [err] = await handleError(
    Model.updateOne({ _id }, { notProcessed: false }),
  );
  if (err) {
    return [false, err];
  }
  return [true, null];
}

async function findAndUpdateAPending(_id, Model, idOfSpecificUpdate) {
  let ti = time();
  const [err, model] = await handleError(Model.findById(_id));
  if (err) {
    return [false, err];
  }
  ti = ti();
  let changeToMake = null;
  for (let i = 0; i < model.pendingChanges.length; i += 1) {
    const change = model.pendingChanges[i];
    if (String(change._id) === String(idOfSpecificUpdate)) {
      changeToMake = change;
      model.pendingChanges = remove(model.pendingChanges, i);
      break;
    }
  }
  if (!changeToMake) return [false, new Error('Not found a change!')];
  try {
    const t = changeToMake.typeOfChange;
    const data = changeToMake.data[t];
    if (t !== '_id' && t !== 'likes' && t !== 'usersLiked') {
      model[t] = data;
      const modelEnd = await model.save();
      return [modelEnd, null];
    }
    ti = ti();
    return [false, new Error('Forbidden attribute to change!')];
  } catch (err) {
    return [false, err];
  }
}

async function addUpdateRequest(_id, Model, { body }, type) {
  try {
    const model = await Model.findById(_id);
    if (!model) return [false, 'Not found.'];
    const keys = Object.keys(body);
    const createChange = (data, type) => ({
      typeOfChange: type,
      data: { [type]: data },
    });
    const changes = [];
    keys.forEach(element => {
      const data = parse(body[element]);
      const doChanges =
        typeof AVAILABLE_UPDATES[type][element] === 'function' &&
        AVAILABLE_UPDATES[type][element](data);
      if (doChanges) {
        changes.push(createChange(data, element));
      } else {
        console.log('not accepted the change.');
        console.log(data, typeof data, element);
      }
    });
    changes.forEach(change => model.pendingChanges.push(change));
    const modelSaved = await model.save();
    createOpinionObject(
      modelSaved.pendingChanges.slice(
        modelSaved.pendingChanges.length - changes.length,
        modelSaved.pendingChanges.length,
      ),
    );
    return [modelSaved, null];
  } catch (err) {
    console.log(err);
    return [false, err];
  }
}

/**
 * @description Updates an item or marks a new item as processed, as an admin. If you wanna update a user edit petition pass idOfSpecificUpdate
 * @param {String} type,
 * @param {String} _id,
 * @param {String} idOfSpecificUpdate,
 */
module.exports = async (type, _id, idOfSpecificUpdate = null, body = {}) => {
  switch (type) {
    case 'ALBUM':
      return findAndProcess(_id, Album);
    case 'ARTIST':
      return findAndProcess(_id, Artist);
    case 'UPDATE_ALBUM':
      return findAndUpdateAPending(_id, Album, idOfSpecificUpdate);
    case 'UPDATE_ARTIST':
      return findAndUpdateAPending(_id, Artist, idOfSpecificUpdate);
    case 'UPD_REQ_ARTIST':
      return addUpdateRequest(_id, Artist, body, 'artist');
    default:
      throw new Error('No good type!');
  }
  // eslint-disable-next-line no-unreachable
  return [false, 'Not implemented'];
};

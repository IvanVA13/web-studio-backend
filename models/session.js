const { Schema, model, SchemaTypes } = require('mongoose');

const session = new Schema({
  uid: {
    type: SchemaTypes.ObjectId,
    default: null,
  },
});

const Session = model('session', session);
module.exports = Session;

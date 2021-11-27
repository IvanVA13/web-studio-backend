const { Schema, model } = require('mongoose');

const session = new Schema({
  _id: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
  },
  session: {
    type: Object,
  },
});

const Session = model('session', session);
module.exports = Session;

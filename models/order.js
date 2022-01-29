const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const order = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: 'No comments',
    },
    status: {
      type: String,
      default: 'new',
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

order.plugin(mongoosePaginate);
const Order = model('order', order);

module.exports = Order;

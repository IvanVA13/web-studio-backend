const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const order = new Schema(
  {
    productType: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
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

const Order = require('../models/order');

const create = async (userId, body) => {
  return await Order.create({ ...body, owner: userId });
};

const update = async (orderId, userId, body) => {
  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      owner: userId,
    },
    { ...body },
    { new: true },
  );

  return order;
};

const getAll = async (userId, query) => {
  const { limit = 20, page = 1, sortBy, sortByDesc, favorite } = query;
  const options =
    typeof favorite === 'boolean'
      ? { owner: userId, favorite }
      : { owner: userId };
  const result = await Order.paginate(options, {
    page,
    limit,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
  });
  return result;
};

const getById = async (orderId, userId) => {
  return await Order.findOne({
    _id: orderId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: '_id, email',
  });
};

module.exports = {
  create,
  update,
  getAll,
  getById,
};

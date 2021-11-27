const {
  httpCode,
  statusCode,
  message,
  userRole,
  orderStatus,
} = require('../helpers/constants');
const { create, update, getAll, getById } = require('../repositories/orders');
const { SenderEmailService } = require('../services/email-gen');
const { createSendGridSender } = require('../services/email-senders');
const {
  newOrderEmailTemp,
  cancelOrderEmailTemp,
} = require('../helpers/emailTemp');
require('dotenv').config();
const { NODE_ENV } = process.env;
const verifyEmail = new SenderEmailService(NODE_ENV, createSendGridSender);

const createOrder = async (req, res) => {
  const { body, user } = req;
  const { id, email, LastName, firstName } = user;
  if (body) {
    const { _id, date, name, comment } = await create(id, body);
    await verifyEmail.sendEmail(email, {
      userName: `${LastName} ${firstName}`,
      subject: `You make order № ${_id}`,
      ...newOrderEmailTemp,
      table: {
        data: [
          {
            date: date.toDateString().replace(/^\w+\s|T\w+$/, ''),
            name,
            comment,
          },
        ],
      },
    });
    return res.status(httpCode.CREATED).json({
      status: statusCode.SUCCESS,
      code: httpCode.CREATED,
      data: {
        order: {
          _id,
          name,
          comment,
        },
      },
    });
  }
};

const updateOrder = async (req, res) => {
  const {
    body,
    user,
    params: { id },
  } = req;
  const { status: reqStatus } = body;
  const { id: userId, email, role, LastName, firstName } = user;

  if (role === userRole.USER && reqStatus === orderStatus.CANCEL) {
    const order = await update(id, userId, {
      status: reqStatus,
    });
    if (order) {
      const { date, name, comment, status } = order;
      await verifyEmail.sendEmail(email, {
        userName: `${LastName} ${firstName}`,
        subject: `You cancel order № ${id}`,
        ...cancelOrderEmailTemp,
        table: {
          data: [
            {
              date: date.toDateString().replace(/^\w+\s|T\w+$/, ''),
              name,
              comment,
            },
          ],
        },
      });
      return res.json({
        status: statusCode.SUCCESS,
        code: httpCode.OK,
        data: {
          order: {
            status,
          },
        },
      });
    } else {
      return res.json({
        status: statusCode.SUCCESS,
        code: httpCode.OK,
        message: message.ORDER_NOT_FOUND,
      });
    }
  }
  if (role === userRole.MANAGER && reqStatus !== orderStatus.NEW) {
    const { clientId } = body;
    const { status } = await update(id, clientId, {
      status: reqStatus,
    });
    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      data: {
        order: {
          status,
        },
      },
    });
  }
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    message: message.NOT_VALID,
  });
};

const getAllOrders = async (req, res) => {
  // TODO add rule for manager

  const {
    user: { id: userId },
    query,
  } = req;
  const { docs: orders, ...other } = await getAll(userId, query);
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      other,
      orders,
    },
  });
};

const getOrderById = async (req, res) => {
  // TODO add rule for manager

  const { params, user } = req;
  const { id: orderId } = params;
  const { id: userId } = user;

  const order = await getById(orderId, userId);
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      order,
    },
  });
};

module.exports = {
  createOrder,
  updateOrder,
  getAllOrders,
  getOrderById,
};

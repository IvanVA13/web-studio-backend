const { Types } = require('mongoose');
const { BadRequest, NotFound } = require('http-errors');
const { v4: uuid } = require('uuid');

const {
  httpCode,
  statusCode,
  message,
  userRole,
  orderStatus,
} = require('../helpers/constants');
const { create, update, getAll, getById } = require('../repositories/orders');
const { createUser, getUserByEmailOrPhone } = require('../repositories/users');
const { SenderEmailService } = require('../services/email-gen');
const { createSendGridSender } = require('../services/email-senders');
const {
  verifyEmailTemp,
  newOrderEmailTemp,
  cancelOrderEmailTemp,
} = require('../helpers/emailTemp');
require('dotenv').config();
const { NODE_ENV } = process.env;
const sendedEmail = new SenderEmailService(NODE_ENV, createSendGridSender);

const createOrder = async (req, res) => {
  const { body } = req;
  const { name, phone, email, productType, comment } = body;
  const user = await getUserByEmailOrPhone(email, phone);
  let uid = '';
  let firstName = '';
  let lastName = '';
  if (!user) {
    const splitName = name.split(' ');
    const password = uuid();
    const verifyEmailToken = uuid();
    const newUser = await createUser({
      firstName: splitName[0],
      lastName: splitName[1],
      email,
      phone: phone.replace(
        /([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{2})([0-9]{2})/,
        '$1($2)-$3-$4-$5',
      ),
      password,
      verifyEmailToken,
    });

    uid = newUser.id;
    firstName = newUser.firstName;
    lastName = newUser.lastName;

    await sendedEmail.sendEmail(email, {
      userName: `${firstName} ${lastName}`,
      link: `verify/${verifyEmailToken}`,
      instructions: `Password from your account is: ${password}`,
      ...verifyEmailTemp,
    });
  }

  if (user) {
    uid = user.id;
    firstName = user.firstName;
    lastName = user.lastName;
  }

  const {
    _doc: {
      _id,
      productType: resProductType,
      comment: resComment,
      createdAt,
      ...rest
    },
  } = await create(uid, {
    productType,
    comment,
  });
  await sendedEmail.sendEmail(email, {
    userName: `${firstName} ${lastName}`,
    subject: `You make order № ${_id}`,
    ...newOrderEmailTemp,
    table: {
      data: [
        {
          date: createdAt.toDateString().replace(/^\w+\s|T\w+$/, ''),
          productType: resProductType,
          comment: resComment,
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
        productType: resProductType,
        comment: resComment,
        createdAt,
        ...rest,
      },
    },
  });
};

const updateOrder = async (req, res) => {
  const {
    body,
    user,
    params: { id },
  } = req;
  const { status: reqStatus } = body;
  const { id: userId, email, role, lastName, firstName } = user;

  if (role === userRole.USER && reqStatus === orderStatus.CANCEL) {
    const order = await update(id, userId, {
      status: reqStatus,
    });
    if (!order) {
      return res.status(httpCode.NOT_FOUND).json({
        status: statusCode.ERR,
        code: httpCode.NOT_FOUND,
        message: message.ORDER_NOT_FOUND,
      });
    }
    const {
      _doc: { createdAt, productType, comment, status, ...rest },
    } = order;
    await sendedEmail.sendEmail(email, {
      userName: `${firstName} ${lastName}`,
      subject: `You cancel order № ${id}`,
      ...cancelOrderEmailTemp,
      table: {
        data: [
          {
            date: createdAt.toDateString().replace(/^\w+\s|T\w+$/, ''),
            productType,
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
          productType,
          comment,
          status,
          createdAt,
          ...rest,
        },
      },
    });
  }
  if (role === userRole.MANAGER && reqStatus !== orderStatus.NEW) {
    const { clientId } = body;
    const { status } = await update(id, clientId, {
      status: reqStatus,
    });
    if (!status) {
      return res.status(httpCode.NOT_FOUND).json({
        status: statusCode.ERR,
        code: httpCode.NOT_FOUND,
        message: message.ORDER_NOT_FOUND,
      });
    }
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
  return res.status(httpCode.BAD_REQUEST).json({
    status: statusCode.ERR,
    code: httpCode.BAD_REQUEST,
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
  if (!Types.ObjectId.isValid(orderId)) {
    throw new BadRequest(message.NOT_VALID);
  }
  const order = await getById(orderId, userId);
  if (!order) {
    throw new NotFound(message.ORDER_NOT_FOUND);
  }
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

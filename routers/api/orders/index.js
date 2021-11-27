const express = require('express');

const {
  createOrder,
  updateOrder,
  getAllOrders,
  getOrderById,
} = require('../../../controllers/orders');
const asyncWrapper = require('../../../helpers/asyncWrapper');
const guard = require('../../../helpers/guard');
const { validNewOrder, validUpdateOrder } = require('./validation');

const router = express.Router();

router.post('/create', guard, validNewOrder, asyncWrapper(createOrder));
router.patch('/:id/status', guard, validUpdateOrder, asyncWrapper(updateOrder));
router.get('/', guard, asyncWrapper(getAllOrders));
router.get('/:id', guard, asyncWrapper(getOrderById));

module.exports = router;

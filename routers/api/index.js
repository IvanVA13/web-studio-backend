const express = require('express');
const router = express.Router();

const users = require('./users');
const orders = require('./orders');

router.use('/users', users);
router.use('/orders', orders);

module.exports = router;

const verifyEmailTemp = {
  subject: 'Verify your account',
  btnText: 'Click here to verify',
};

const newOrderEmailTemp = {
  intro: 'Your order has been processed successfully',
  instructions: 'You can check your order in order list:',
  btnText: 'Go to order list',
  link: 'orders',
};
const cancelOrderEmailTemp = {
  intro: 'Your order has been canceled',
  instructions: 'You can check your order status in order list:',
  btnText: 'Go to order list',
  link: 'orders',
};

module.exports = { verifyEmailTemp, newOrderEmailTemp, cancelOrderEmailTemp };

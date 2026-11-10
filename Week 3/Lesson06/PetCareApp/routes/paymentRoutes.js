const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();
router.post('/payments/prepare', paymentController.preparePayment);
router.get('/payments/prepare/:serviceId', paymentController.preparePayment);
router.post(
   '/payments/mock/:serviceId',
   paymentController.createMockPayment
 );

module.exports = router;

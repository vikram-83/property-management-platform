const Payment = require('../models/Payment');

const getPaymentSummary = async (tenantId) => {
  const payments = await Payment.find(tenantId ? { tenant: tenantId } : {});
  return {
    total: payments.length,
    amount: payments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
    data: payments,
  };
};

module.exports = { getPaymentSummary };

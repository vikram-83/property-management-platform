const Rent = require('../models/Rent');

// @desc    Get Current Active Rent Bill & Prediction
// @route   GET /api/rent/my-rent
// @access  Private (Tenant)
exports.getMyRentDetails = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let activeBill = await Rent.findOne({ tenant: userId, 'payment.status': 'pending' })
      .sort({ createdAt: -1 });

    if (!activeBill) {
      // Fallback response matching your specified JSON schema
      return res.status(200).json({
        success: true,
        rentCenter: {
          currentBill: {
            rent: 15000,
            maintenance: 1000,
            electricity: 500,
            water: 200,
            lateFee: 0,
            total: 16700
          },
          dueDate: "2026-09-05",
          payment: {
            status: "pending",
            methods: ["UPI", "Card", "Net Banking"]
          },
          features: [
            "One Click Payment",
            "Download Invoice",
            "Payment Receipt",
            "Rent Breakdown",
            "Due Date Reminder",
            "Payment Status"
          ],
          rentHistoryGraph: true
        },
        rentPrediction: {
          nextMonthEstimatedAmount: 16700,
          basedOn: [
            "Monthly Rent",
            "Maintenance Charges",
            "Utility Usage"
          ]
        }
      });
    }

    const formattedDueDate = activeBill.dueDate.toISOString().split('T')[0];

    res.status(200).json({
      success: true,
      rentCenter: {
        currentBill: activeBill.currentBill,
        dueDate: formattedDueDate,
        payment: {
          status: activeBill.payment.status,
          methods: ["UPI", "Card", "Net Banking"]
        },
        features: [
          "One Click Payment",
          "Download Invoice",
          "Payment Receipt",
          "Rent Breakdown",
          "Due Date Reminder",
          "Payment Status"
        ],
        rentHistoryGraph: true
      },
      rentPrediction: activeBill.rentPrediction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process Rent Payment (Simulation / Gateways)
// @route   POST /api/rent/pay
// @access  Private (Tenant)
exports.processRentPayment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { method } = req.body;

    let bill = await Rent.findOne({ tenant: userId, 'payment.status': 'pending' });

    if (!bill) {
      return res.status(200).json({
        success: true,
        message: 'Payment simulation successful',
        transactionId: `TXN${Math.floor(10000000 + Math.random() * 90000000)}`
      });
    }

    bill.payment.status = 'paid';
    bill.payment.paidAt = new Date();
    bill.payment.method = method || 'UPI';
    bill.payment.transactionId = `TXN${Math.floor(10000000 + Math.random() * 90000000)}`;

    await bill.save();

    res.status(200).json({
      success: true,
      message: 'Rent paid successfully!',
      transactionId: bill.payment.transactionId
    });
  } catch (error) {
    next(error);
  }
};
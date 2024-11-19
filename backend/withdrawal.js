// models/Withdrawal.js
const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    transactionDate: { type: Date, default: Date.now },
    paymentMethod: { type: String },  // e.g., 'Bank Transfer', 'Crypto'
    transactionId: { type: String, unique: true },
    userPin: { type: String, required: true }, // Store PIN if needed
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
module.exports = Withdrawal;

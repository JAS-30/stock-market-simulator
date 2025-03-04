const mongoose = require('mongoose');

// Transaction Schema (Now a separate collection)
const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    companyName: { type: String, required: true },
    quantity: { type: Number, required: true }, // +ve for buy, -ve for sell
    price: { type: Number, required: true }, // Price per share
    totalCost: { type: Number, required: true }, // quantity * price
    transactionType: { type: String, enum: ['buy', 'sell'], required: true },
    date: { type: Date, default: Date.now }
});

// Portfolio Schema (Embedded inside User)
const portfolioSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    companyName: { type: String, required: true },
    quantity: { type: Number, required: true }, // Total shares owned
    averagePrice: { type: Number, required: true }, // Adjusted when buying/selling
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    capital: { type: Number, default: 10000 },  // Starting capital ($10,000)
    portfolio: [portfolioSchema] // Portfolio as an array of stocks
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { User, Transaction };

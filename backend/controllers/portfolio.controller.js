const { User, Transaction } = require('../model');  

// Get user portfolio
const getPortfolio = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            portfolio: user.portfolio || [],  // Ensure it's always an array
            capital: user.capital || 0        // Ensure it's always a number
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching portfolio', error: err });
    }
};


// Buy stock
const addStockToPortfolio = async (req, res) => {
    const { symbol, companyName, quantity, purchasePrice } = req.body;

    if (quantity <= 0 || purchasePrice <= 0) {
        return res.status(400).json({ message: 'Invalid quantity or price' });
    }

    try {
        const user = await User.findById(req.userId); // Fetch user based on the JWT token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const totalCost = quantity * purchasePrice;
        if (user.capital < totalCost) {
            return res.status(400).json({ message: 'Insufficient capital' });
        }

        // Deduct capital from user's account
        user.capital -= totalCost;

        // Save transaction (for historical purposes)
        const transaction = new Transaction({
            userId: user._id,
            symbol,
            companyName,
            quantity,
            price: purchasePrice,
            totalCost,
            transactionType: 'buy',
        });
        await transaction.save(); // Save the transaction record

        // Update portfolio
        const existingStock = user.portfolio.find(stock => stock.symbol === symbol);
        if (existingStock) {
            // Adjust average price and increase quantity
            existingStock.averagePrice = ((existingStock.quantity * existingStock.averagePrice) + totalCost) / (existingStock.quantity + quantity);
            existingStock.quantity += quantity;
        } else {
            // Add new stock to the portfolio
            user.portfolio.push({
                symbol,
                companyName,
                quantity,
                averagePrice: purchasePrice,
            });
        }

        // Save user with updated capital and portfolio
        await user.save();

        res.json({ message: 'Stock purchased and added to portfolio', portfolio: user.portfolio });
    } catch (err) {
        console.error('Error adding stock to portfolio:', err); // Log error for debugging
        res.status(500).json({ message: 'Error adding stock to portfolio', error: err });
    }
};

// Sell stock
const sellStockFromPortfolio = async (req, res) => {
    const { symbol, quantity, salePrice } = req.body;

    if (quantity <= 0 || salePrice <= 0) {
        return res.status(400).json({ message: 'Invalid quantity or price' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const stock = user.portfolio.find(stock => stock.symbol === symbol);
        if (!stock || stock.quantity < quantity) {
            return res.status(400).json({ message: 'Not enough shares to sell' });
        }

        // Calculate total earnings from sale
        const totalEarnings = quantity * salePrice;
        user.capital += totalEarnings;

        // Save transaction
        const transaction = new Transaction({
            userId: user._id,
            symbol,
            companyName: stock.companyName,
            quantity: -quantity, // Negative quantity for selling
            price: salePrice,
            totalCost: totalEarnings,
            transactionType: 'sell',
        });
        await transaction.save();

        // Update portfolio
        stock.quantity -= quantity;
        if (stock.quantity === 0) {
            user.portfolio = user.portfolio.filter(s => s.symbol !== symbol);
        }

        await user.save();
        res.json({ message: 'Stock sold and portfolio updated', portfolio: user.portfolio });
    } catch (err) {
        res.status(500).json({ message: 'Error selling stock from portfolio', error: err });
    }
};

module.exports = { getPortfolio, addStockToPortfolio, sellStockFromPortfolio };

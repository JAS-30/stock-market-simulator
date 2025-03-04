const express = require('express');
const { getPortfolio, addStockToPortfolio, sellStockFromPortfolio } = require('../controllers/portfolio.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/portfolio', authMiddleware, getPortfolio);
router.post('/portfolio/buy', authMiddleware, addStockToPortfolio);
router.post('/portfolio/sell', authMiddleware, sellStockFromPortfolio);

module.exports = router;
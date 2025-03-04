const express = require('express');
const router = express.Router();
const { getStockData,searchStocks , getStockHistory} = require('../controllers/stock.controller');
const authMiddleware = require('../middleware/auth');

router.get('/stock/:symbol', authMiddleware, getStockData);

router.get("/stock/:symbol/history/:range", authMiddleware,getStockHistory);

router.get('/stocks/:name' , authMiddleware,searchStocks);

module.exports = router;
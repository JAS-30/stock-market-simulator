const express = require('express');
const { registerUser, loginUser, deleteUserAccount } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.delete('/delete-account', authMiddleware, deleteUserAccount);

module.exports = router;
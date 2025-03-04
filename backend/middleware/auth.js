const { config } = require('dotenv');
const jwt = require('jsonwebtoken');
require('dotenv'),config();

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token){
        return res.status(403).json({message: 'No token provided, access denied.'});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({message: 'Invalid or expired token.'});
        }

        req.userId = decoded.userId;
        next();
    });
};

module.exports = authMiddleware;
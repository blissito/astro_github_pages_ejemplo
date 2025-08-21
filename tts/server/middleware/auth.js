const jwt = require('jsonwebtoken');
const db = require('../../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db('users')
      .where('id', decoded.userId)
      .first();
    return user;
  } catch (error) {
    return null;
  }
};

const required = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      }
    });
  }

  const user = await verifyToken(token);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }
    });
  }

  req.user = user;
  next();
};

const optional = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    const user = await verifyToken(token);
    req.user = user;
  }
  
  next();
};

module.exports = {
  required,
  optional,
  verifyToken
};
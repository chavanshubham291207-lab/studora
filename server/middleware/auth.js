const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token, access denied' });
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Malformed token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'studora_jwt_secret_key_12345');
    req.user = decoded; // Contains id and role
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permission required' });
  }
};

module.exports = { authMiddleware, adminMiddleware };

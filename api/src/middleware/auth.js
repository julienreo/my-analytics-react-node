const jwt = require('jsonwebtoken');

// Token authentication
module.exports = (req, res, next) => {
  const hasToken = req.headers['x-access-token'] ? true : false;
  if (!hasToken) return res.status(401).send({ message: 'Missing token'});

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ message: 'Failed to authenticate user' });
    
    // Add decoded token to request
    req.token = decoded;
    next();
  });
};
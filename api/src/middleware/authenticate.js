const jwt = require('jsonwebtoken');

// Token authentication
module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const hasToken = typeof token !== 'undefined' ? true : false;

  // If token is missing
  if (!hasToken) {
    return res.status(401).json({ message: 'Missing token'});
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    
    // If token could not be verified
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate user' });
    }

    // Add decoded token to request objet
    req.token = decoded;
    next();
  });
};
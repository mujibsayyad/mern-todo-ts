const jwt = require('jsonwebtoken');

const authJWT = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Authentication failed!',
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.log('authJWT error', error);
    res.status(401).json({
      message: 'authJWT Unauthorized: token invalid',
    });
  }
};

module.exports = authJWT;

const unAuthenticatedError = require("../errors/unAuthenticated");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new unAuthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
    next()
  } catch (err) {
    throw new unAuthenticatedError("Authentication failed");
  }
};

module.exports = authMiddleware
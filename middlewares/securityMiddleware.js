const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied . No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.decodedToken = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid Token or Expired Token" });
  }
};

const hashPassword = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};



module.exports = { authenticateToken, hashPassword, checkRole };

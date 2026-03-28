const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // 1. Token lo request header se
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // 2. Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. User id attach karo request mein
    req.user = decoded;

    next(); // aage badhao

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
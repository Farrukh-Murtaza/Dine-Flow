require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

async function verifyAuthentication(req, res, next) {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No bearer token or incorrect format. Authentication denied." });
        }

        token = token.split(" ")[1];
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the LATEST user data from the database for user isActive status
          const user = await User.findById(decodedPayload._id);
        if (!user) {
            return res.status(401).json({ message: "User no longer exists." });
        }

        // 2. Enforce the isActive check in real-time
        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated." });
        }

        req.user = decodedPayload;

        next();
  } catch(error) {
    console.error(error);
    res.status(401).json({ message: "Token is invalid." });
  }
};

module.exports = verifyAuthentication;
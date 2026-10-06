const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

async function me(req, res) {
  

    try{
        if(!req.user) return res.status(401).json({message: "User must register or login"});
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({
            message: "User Authenticated",
            user
        });

    }catch(error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }

}

async function login(req, res) {

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password."} );
    }

    // look for active status user
    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated. Please contact support." });
    }

    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    const payload = { _id: user._id, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ message: "User logged in successfully!", token, user : userResponse });
  } catch(error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
    me,
    login
}
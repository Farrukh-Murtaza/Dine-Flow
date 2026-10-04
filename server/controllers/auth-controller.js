const User = require("../models/user-model");

async function me(req, res) {

    try{
        if(!req.user) return res.status(401).json({message: "User must register or login"});
        const user = await User.findById(req.user._id).selelct("-password");
        res.status(200).json({
            message: "User Authenticated",
            user
        });

    }catch(error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }

    
}

async function login() {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password."} );
    }

    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    const payload = { _id: user._id, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "User logged in successfully!", token });
  } catch(error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
    me,
    login
}
const User = require("../models/user-model");


async function AppSetupMiddlware (req, res, next){

    try {
        const ownerExist = await User.exists({role: "owner"});

        if(ownerExist){
            return res.status(403).json({
                 message: "Access Denied: Application setup has already been completed." 
            });
        }

        next();
    } catch(error) {
        console.error("Setup Middleware Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
  }

} 


module.exports = AppSetupMiddlware;

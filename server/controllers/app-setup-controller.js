const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/restaurant-model");
const User = require("../models/user-model");



async function appSetup(req, res) {
    const {email, username, password} = req.body;
    // creating a session
    const session = await mongoose.startSession();

    try {
        // Start the transcation - for creation
        session.startTransaction();

        const [owner] = await User.create([{
            email,
            password,
            username,
            role: "owner",
       }], {session});

        const [restaurant] = await Restaurant.create([{
            name: req.body.restaurantName,
            address: req.body.address,
            phone: req.body.phone
        }], {session});

        const payload = {
            _id: owner._id,
            role: owner.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // commit the transacation
        await session.commitTransaction();
        console.log('Transaction committed successfully.');
        
        res.status(201).json({
            message: `${restaurant.name} is setup successfully.`,
            token
        });

        
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction aborted due to error:", error);
        res.status(400).json({ message: error.message });
    }
    finally{
        await session.endSession();
    }
}


module.exports = appSetup;
const mongoose = require("mongoose");
const Restaurant = require("../models/restaurant-model");



async function getRestaurant(req, res) {
  
    try {
        const restaurants = await Restaurant.find({});
      

        res.status(201).json({
            _id : restaurants[0]._id, 
            name : restaurants[0].name, 
            address : restaurants[0].address, 
            phone : restaurants[0].phone, 
        });

        
    } catch (error) {
        console.error("restaurant: unable to get", error);
        res.status(400).json({ message: error.message });
    }
}


async function updateRestaurant(req, res) {
  
    try {
        const { _id, name, address, phone } = req.body;

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
              _id,
              { name, address, phone },
              { new: true, runValidators: true }
            );
        
            if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found." });
        
            res.status(200).json({ message: "Restaurant updated successfully!", Restaurant: updatedRestaurant });
        
    } catch (error) {
        console.error("restaurant: unable to get", error);
        res.status(400).json({ message: error.message });
    }
}



module.exports = {
    getRestaurant,
    updateRestaurant
};
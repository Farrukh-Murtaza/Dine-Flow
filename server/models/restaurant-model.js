const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "Address is required."],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone is required."],
        validator: function(v) {
           return /^(?:\+1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v);
        },
        message: props => `${props.value} is not a valid US phone number!`
    }
},
    { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", schema);

module.exports = Restaurant;

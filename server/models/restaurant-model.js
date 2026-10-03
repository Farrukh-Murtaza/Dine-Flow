const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        message: "Name is required."
    },
    address: {
        type: String,
        required: true,
        message: "Address is required."
    },
    phone: {
        type: String,
        required: true,
        validator: function(v) {
            return /^(?:\+1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\$/.test(v);
        },
        message: props => `${props.value} is not a valid US phone number!`
    }
});

const Restaurant = mongoose.model("Restaurant", schema);

module.exports = Restaurant;

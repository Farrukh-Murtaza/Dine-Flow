const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    match: [/.+@.+\..+/, "Please provide a valid email addres."],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [7, "Password must be at least 7 characters long."],
    trim: true,
    
  },
  role: {
    type: String,
    enum: ["owner", "manager", "cashier", "store keeper"],
    required: [true, "Role is required."],
  }
}, {
  timestamps: true
});

userSchema.pre("save", async function() {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

userSchema.methods.isCorrectPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = new mongoose.model("User", userSchema);

module.exports = User;
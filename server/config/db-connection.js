const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
});

mongoose.connection.on("error", (error) => {
  console.log("MongoDB connection error: ", error);
});

mongoose.connection.once("close", () => {
  console.log("Connection to MongoDB has closed.");
});
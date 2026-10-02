require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        message: "DineFlow API is running."
    });
});

app.listen(PORT, () => {
    console.log(`DineFlow server running on port ${PORT}`);
});
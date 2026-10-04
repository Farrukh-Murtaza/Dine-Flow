require("dotenv").config();
require("./config/db-connection");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const URL = process.env.URL ;
const PORT = process.env.PORT || 5000;
const routes = require("./routes/routes");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));



app.use("/api", routes);


app.get("/", (req, res) => {
    res.json({
        message: "DineFlow API is running."
    });
});

app.listen(PORT, () => {
    console.log(`DineFlow server running at ${URL}:${PORT}`);
});
require("dotenv").config();
require("./config/db-connection");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const URL = process.env.URL ;
const PORT = process.env.PORT || 5000;
const routes = require("./routes/routes");

// const allowedOrigins = [
//   "https://dine-flow-neon.vercel.app/",
//   `${process.env.CLIENT_URL}`                        // Keep localhost for local developmentr Vite users
// ];

// const corsOptions = {
//  origin: (origin, cb) => {
//       // allow non-browser requests (curl, Postman) with no Origin header
//       if (!origin) return cb(null, true);
//       if (allowedOrigins.indexOf(origin) !== -1) {
//         return cb(null, true);
//       }
//       return cb(new Error(`CORS blocked: ${origin}`));
//     },
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// };



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
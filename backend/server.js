
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./config/db");
const authRoutes = require("./routes/auth");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Listening on port ${PORT}...`));

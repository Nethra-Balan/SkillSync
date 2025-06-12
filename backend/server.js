
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const connection = require("./config/db");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Listening on port ${PORT}...`));

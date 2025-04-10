const express = require("express");
const { json, urlencoded } = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { authenticateToken } = require("./middlewares/securityMiddleware.");

const app = express();

app.use([json(), urlencoded({ extended: true })]);

app.use("/users", userRoutes);
app.use("/news", newsRoutes);

module.exports = app;

const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");

//routes
const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");
//config dot env
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Build express app
const app = express();

// Body parser for json
app.use(express.json());

// Morgan for dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routing starts from here
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

// error after this
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

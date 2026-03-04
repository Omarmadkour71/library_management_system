const express = require("express");
const globalErrorHandler = require("./controllers/errorController");
const booksRouter = require("./routes/booksRouter");
const borrowersRouter = require("./routes/borrowersRouter");
const borrowingsRouter = require("./routes/borrowingsRouter");

const app = express();
app.use(express.json());

// Route Handlers
app.use("/books", booksRouter);
app.use("/borrowers", borrowersRouter);
app.use("/borrowings", borrowingsRouter);

// Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;

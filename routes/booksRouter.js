const express = require("express");
const booksController = require("../controllers/booksController");

const booksRouter = express.Router();

// Route Handlers
booksRouter
  .route("/")
  .get(booksController.getAllBooks)
  .post(booksController.addBook);

booksRouter
  .route("/:id")
  .patch(booksController.updateBook)
  .delete(booksController.deleteBook);

booksRouter.route("/search").get(booksController.searchBooks);

module.exports = booksRouter;

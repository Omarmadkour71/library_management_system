const express = require("express");
const borrowersController = require("../controllers/borrowersController");
const borrowingsController = require("../controllers/borrowingsController");

// Creating Router for Borrowers
const borrowersRouter = express.Router();

// Route Handlers
borrowersRouter
  .route("/")
  .post(borrowersController.createBorrower)
  .get(borrowersController.getAllBorrowers);
borrowersRouter
  .route("/:id")
  .patch(borrowersController.updateBorrower)
  .delete(borrowersController.deleteBorrower);

// Getting Borrowers's Active Borrowed books
borrowersRouter
  .route("/:borrowerId/borrowings")
  .get(borrowingsController.getCurrentBorrowed);

module.exports = borrowersRouter;

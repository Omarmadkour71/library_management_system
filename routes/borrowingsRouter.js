const express = require("express");
const borrowingsController = require("../controllers/borrowingsController");

const borrowingsRouter = express.Router();

// Router Handlers
borrowingsRouter
  .route("/")
  .post(borrowingsController.borrowBook)
  .get(borrowingsController.getAllBorrowings);
borrowingsRouter
  .route("/:borrowingId/return")
  .patch(borrowingsController.returnBook);
borrowingsRouter.route("/overdue").get(borrowingsController.getOverdueBooks);

module.exports = borrowingsRouter;

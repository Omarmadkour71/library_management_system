const AppError = require("../utils/appError");
const Prisma = require("@prisma/client");

// handling Errors Function
const handleDuplicateError = (err) => {
  const message = `Duplicate field value: ${err.meta.target.join(", ")}`;
  return new AppError(message, 400);
};

const handleNotFoundError = (err) => {
  const message = `Record not found`;
  return new AppError(message, 404);
};

const handleValidationError = (err) => {
  const message = `Invalid input data type`;
  return new AppError(message, 400);
};

// Error Handling function
const sendError = (err, req, res) => {
  // operational errors => Trusted Errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // non operational errors => not trusted errors
  return res.status(404).json({
    status: "Error",
    message: "Something Went Wrong",
    Error: err,
  });
};

// Exporting Error Handler Middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Prisma unique constraint
  if (err.code === "P2002") error = handleDuplicateError(err);
  // Prisma record not found
  if (err.code === "P2025") error = handleNotFoundError(err);
  // Prisma wrong datatype / validation error
  if (err instanceof Prisma.PrismaClientValidationError)
    error = handleValidationError(err);

  sendError(error, req, res);
};

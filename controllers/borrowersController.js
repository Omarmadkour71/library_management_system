const prisma = require("../prisma/client");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const validator = require("validator");

// Add a Borrower
exports.createBorrower = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  // input validation
  if (!name || !email) {
    return next(new AppError("Name and email are required", 400));
  }

  if (typeof name !== "string") {
    return next(new AppError("Name must be a string", 400));
  }
  if (typeof email !== "string") {
    return next(new AppError("Email must be a string", 400));
  }

  // Email Validation
  if (!validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email address", 400));
  }
  const cleanEmail = validator.normalizeEmail(email);

  const borrower = await prisma.borrower.create({
    data: {
      name: name.trim(),
      email: cleanEmail,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      borrower,
    },
  });
});

// Update borrower’s details.
exports.updateBorrower = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const updatedData = {};
  const id = Number(req.params.id);

  // Validate inputs
  if (name && typeof name !== "string") {
    return next(new AppError("name must be a string", 400));
  }
  if (email && typeof email !== "string") {
    return next(new AppError("title must be a string", 400));
  }

  // updating data
  if (email) {
    if (!validator.isEmail(email)) {
      return next(new AppError("Please provide a valid email address", 400));
    }
    const cleanEmail = validator.normalizeEmail(email);
    updatedData.email = cleanEmail;
  }
  if (name) updatedData.name = name.trim();

  const borrower = await prisma.borrower.update({
    where: {
      id,
    },
    data: updatedData,
  });

  res.status(200).json({
    status: "success",
    data: { borrower },
  });
});

// Delete a borrower.
exports.deleteBorrower = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);
  const borrower = await prisma.borrower.delete({
    where: {
      id,
    },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// List All Borrowers
exports.getAllBorrowers = catchAsync(async (req, res, next) => {
  const borrowers = await prisma.borrower.findMany();

  res.status(200).json({
    status: "success",
    data: {
      borrowers,
    },
  });
});

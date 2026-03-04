const prisma = require("../prisma/client");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Adding a new book
exports.addBook = catchAsync(async (req, res, next) => {
  // Validating Inputs
  const { title, author, isbn, availableQuantity, shelfLocation } = req.body;

  if (!title || !author || !isbn || !shelfLocation || !availableQuantity) {
    return next(new AppError("Missing required fields", 400));
  }
  if (availableQuantity < 0) {
    return next(new AppError("availableQuantity cannot be negative", 400));
  }

  const book = await prisma.book.create({
    data: {
      title,
      author,
      isbn,
      availableQuantity,
      shelfLocation,
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      book,
    },
  });
});

// Update a book Details
exports.updateBook = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);
  const { title, author, isbn, availableQuantity, shelfLocation } = req.body;

  // Validate types if provided
  if (title && typeof title !== "string") {
    return next(new AppError("title must be a string", 400));
  }
  if (author && typeof author !== "string") {
    return next(new AppError("author must be a string", 400));
  }
  if (isbn && typeof isbn !== "string") {
    return next(new AppError("isbn must be a string", 400));
  }
  if (availableQuantity != null && availableQuantity < 0) {
    return next(new AppError("availableQuantity cannot be negative", 400));
  }
  if (shelfLocation && typeof shelfLocation !== "string") {
    return next(new AppError("title must be a string", 400));
  }

  // updating book
  const updatedData = {};
  if (title) updatedData.title = title.trim();
  if (author) updatedData.author = author.trim();
  if (isbn) updatedData.isbn = isbn.trim();
  if (availableQuantity != null)
    updatedData.availableQuantity = availableQuantity;
  if (shelfLocation) updatedData.shelfLocation = shelfLocation.trim();

  const book = await prisma.book.update({
    where: {
      id,
    },
    data: updatedData,
  });

  res.status(201).json({
    status: "Success",
    data: {
      book,
    },
  });
});

// Delete a book
exports.deleteBook = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);
  const book = await prisma.book.delete({
    where: {
      id,
    },
  });

  res.status(204).json({
    status: "Success",
    data: null,
  });
});

// List all books
exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await prisma.book.findMany();
  res.status(200).json({
    status: "Success",
    data: {
      books,
    },
  });
});

// Search for a book by title, author, or ISBN
exports.searchBooks = catchAsync(async (req, res, next) => {
  const { title, author, isbn } = req.query;

  const queryString = {};
  if (title) {
    queryString.title = { contains: title, mode: "insensitive" };
  }
  if (author) {
    queryString.author = { contains: author, mode: "insensitive" };
  }
  if (isbn) {
    queryString.isbn = { contains: isbn, mode: "insensitive" };
  }

  const books = await prisma.book.findMany({
    where: queryString,
  });

  res.status(200).json({
    status: "success",
    data: {
      books,
    },
  });
});

const prisma = require("../prisma/client");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// A borrower can check out a book.
exports.borrowBook = catchAsync(async (req, res, next) => {
  const borrowerId = Number(req.body.borrowerId);
  const bookId = Number(req.body.bookId);
  const dueDate = new Date(req.body.dueDate);

  if (isNaN(borrowerId) || isNaN(bookId)) {
    return next(new AppError("Invalid borrowerId or bookId", 400));
  }

  const result = await prisma.$transaction(async (tx) => {
    const borrower = await tx.borrower.findUnique({
      where: { id: borrowerId },
    });

    if (!borrower) {
      throw new AppError("Borrower not found", 404);
    }

    const book = await tx.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    if (book.availableQuantity <= 0) {
      throw new AppError("Book is not available", 400);
    }

    // Create borrowing
    const borrowing = await tx.borrowing.create({
      data: {
        borrowerId,
        bookId,
        dueDate,
      },
    });

    // Decrease quantity
    await tx.book.update({
      where: { id: bookId },
      data: {
        availableQuantity: {
          decrement: 1,
        },
      },
    });

    return borrowing;
  });

  res.status(201).json({
    status: "success",
    data: {
      borrowing: result,
    },
  });
});

// A borrower can return a book
exports.returnBook = catchAsync(async (req, res, next) => {
  const borrowingId = Number(req.params.borrowingId);
  if (isNaN(borrowingId)) {
    return next(new AppError("Invalid Borrowing ID", 400));
  }

  const result = await prisma.$transaction(async (tx) => {
    const borrowing = await prisma.borrowing.findUnique({
      where: {
        id: borrowingId,
      },
    });
    if (!borrowing) {
      return next(new AppError("Borrowing Not Found!", 404));
    }
    if (borrowing.returnedAt) {
      return next(new AppError("Book Already returned", 400));
    }

    // updating borrowing and book
    const updatedBorrowing = await tx.borrowing.update({
      where: {
        id: borrowingId,
      },
      data: {
        returnedAt: new Date(),
      },
    });
    await tx.book.update({
      where: {
        id: updatedBorrowing.bookId,
      },
      data: {
        availableQuantity: { increment: 1 },
      },
    });
    return updatedBorrowing;
  });

  res.status(200).json({
    status: "success",
    data: {
      borrowing: result,
    },
  });
});

// A borrower can check the books they currently have
exports.getCurrentBorrowed = catchAsync(async (req, res, next) => {
  const borrowerId = Number(req.params.borrowerId);
  if (isNaN(borrowerId)) {
    return next(new AppError("Invalied Borrower ID", 400));
  }
  const borrowing = await prisma.borrowing.findMany({
    where: {
      borrowerId,
      returnedAt: null,
    },
    include: {
      book: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      borrowing,
    },
  });
});

// list all borrowings
exports.getAllBorrowings = catchAsync(async (req, res, next) => {
  const borrowings = await prisma.borrowing.findMany();
  res.status(200).json({
    status: "success",
    data: {
      borrowings,
    },
  });
});

// list books that are overdue
exports.getOverdueBooks = catchAsync(async (req, res, next) => {
  const now = new Date();
  const overdue = await prisma.borrowing.findMany({
    where: {
      dueDate: {
        lt: now,
      },
      //returnedAt: null,
    },
    include: {
      borrower: true,
      book: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: { overdue },
  });
});

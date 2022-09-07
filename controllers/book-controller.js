const IssuedBook = require("../dtos/book-dto");
const IssuedBooksWithFine = require("../dtos/book-dto");
const { BookModel, UserModel } = require("../models");

exports.getAllBooks = async (req, res) => {
  const books = await BookModel.find();

  if (books.length === 0)
    return res.status(404).json({
      success: false,
      message: "No book found",
    });

  res.status(200).json({
    success: true,
    data: books,
  });
};

exports.getSingleBookById = async (req, res) => {
  const { id } = req.params;

  const book = await BookModel.findById(id);

  if (!book)
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });

  return res.status(200).json({
    success: true,
    data: book,
  });
};

// Additional route
exports.getSingleBookByName = async (req, res) => {
  const { name } = req.params;

  console.log(name);

  const book = await BookModel.findOne({
    name: name,
  });

  if (!book)
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });

  return res.status(200).json({
    success: true,
    data: book,
  });
};

exports.getAllIssuedBooks = async (req, res) => {
  const users = await UserModel.find({
    issuedBook: { $exists: true },
  }).populate("issuedBook");

  const issuedBooks = users.map((each) => new IssuedBook(each));

  if (issuedBooks.length === 0)
    return res.status(404).json({
      success: false,
      message: "No books issued yet",
    });

  return res.status(200).json({
    success: true,
    data: issuedBooks,
  });
};

exports.addNewBook = async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "No data provided",
    });
  }

  await BookModel.create(data);

  const allBooks = await BookModel.find();

  return res.status(201).json({
    success: true,
    data: allBooks,
  });
};

exports.updateBookById = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      _id: id,
    },
    data,
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: updatedBook,
  });
};

exports.getissuedBooksWithFine = async (req, res) => {
  const users = await UserModel.find({
    issuedBook: { $exists: true },
  }).populate("issuedBook");

  const issuedBooks = users.map((each) => new IssuedBooksWithFine(each));

  if (issuedBooks.length === 0)
    return res.status(404).json({
      success: false,
      message: "No books issued yet",
    });

    const getDateInDays = (data = "") => {
      let date;
      if (data === "") {
        // current date
        date = new Date();
      } else {
        // getting date on basis of data variable
        date = new Date(data);
      }
      let days = Math.floor(date / (1000 * 60 * 60 * 24));
      return days;
    };
  
    const subscriptionType = (date) => {
      if (users.subscriptionType === "Basic") {
        date = date + 90;
      } else if (users.subscriptionType === "Standard") {
        date = date + 180;
      } else if (users.subscriptionType === "Premium") {
        date = date + 365;
      }
      return date;
    };
  
    // Subscription expiration calculation
    // January 1, 1970, UTC. // milliseconds
    let returnDate = getDateInDays(users.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(users.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);
  
    const data = {
      subscriptionExpired: subscriptionExpiration < currentDate,
      daysLeftForExpiration:
        subscriptionExpiration <= currentDate
          ? 0
          : subscriptionExpiration - currentDate,
      fine:
        returnDate < currentDate
          ? subscriptionExpiration <= currentDate
            ? 200
            : 100
          : 0,
    };

    const issuedBooksWithFine = {
      ...data,
      ...issuedBooks
  };

  return res.status(200).json({
    success: true,
    issuedBooksWithFine,
  });
};
// Data Transform Object

class IssuedBook {
    _id;
    name;
    genre;
    price;
    publisher;
    issuedBy;
    issuedDate;
    returnDate;
  
    constructor(user) {
      this._id = user.issuedBook._id;
      this.name = user.issuedBook.name;
      this.genre = user.issuedBook.genre;
      this.price = user.issuedBook.price;
      this.publisher = user.issuedBook.publisher;
      this.issuedBy = user.name;
      this.issuedDate = user.issuedDate;
      this.returnDate = user.returnDate;
    }
  }
  class IssuedBooksWithFine {
    _id;
    name;
    genre;
    price;
    publisher;
    issuedBy;
    issuedDate;
    returnDate;
    subscriptionType;
    subscriptionDate;
    subscriptionExpiration;
    fine;
  
    constructor(user) {
      this._id = user.issuedBook._id;
      this.name = user.issuedBook.name;
      this.genre = user.issuedBook.genre;
      this.price = user.issuedBook.price;
      this.publisher = user.issuedBook.publisher;
      this.issuedBy = user.name;
      this.issuedDate = user.issuedDate;
      this.returnDate = user.returnDate;
      this.subscriptionType = user.subscriptionType;
      this.subscriptionDate = user.subscriptionDate;
      this.subscriptionExpiration = user.subscriptionExpiration;
      this.fine = user.fine;
    }
  }
  module.exports = IssuedBook;
  module.exports = IssuedBooksWithFine;
  
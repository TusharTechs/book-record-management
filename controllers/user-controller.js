const { UserModel, BookModel } = require("../models");

exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find();

  if (users.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No users found",
    });
  }

  res.status(200).json({
    success: true,
    data: users,
  });
};

exports.getSingleUserById = async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById({ _id: id });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
};

exports.createNewUser = async (req, res) => {
  const { data } = req.body;

  const newUser = await UserModel.create(data);

  return res.status(201).json({
    success: true,
    data: newUser,
  });
};

exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const updatedUserData = await UserModel.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        ...data,
      },
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: updatedUserData,
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.deleteOne({
    _id: id,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User to be deleted was not found",
    });
  }

  return res
    .status(202)
    .json({ success: true, message: "Deleted the user successfully" });
};

exports.getSubscriptionDetailsById = async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById(id);

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      // current date
      date = new Date();
    } else {
      // getting date on bacis of data variable
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else if (user.subscriptionType === "Premium") {
      date = date + 365;
    }
    return date;
  };

  // Subscription expiration calculation
  // January 1, 1970, UTC. // milliseconds
  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  console.log("Return Date ", returnDate);
  console.log("Current Date ", currentDate);
  console.log("Subscription Date ", subscriptionDate);
  console.log("Subscription expiry date", subscriptionExpiration);

  const data = {
    ...user._doc,
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

  res.status(200).json({
    success: true,
    data,
  });
};
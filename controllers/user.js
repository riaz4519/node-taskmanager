const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc Create a new user
// @route POST /api/v1/users/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getSignedUserToken();

  return res.status(201).json({
    success: true,
    token,
  });
});

// @desc : Login a user
// @route POST /api/v1/users/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  const user = await User.findOne({ email: email }).select("+password");

  //check user exists or not
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //check password is correct
  const match = await user.matchPassword(password);

  if (!match) {
    return next(new errorResponse("Invalid credentials", 401));
  }

  //get token and send response
  const token = user.getSignedUserToken();

  return res.status(200).json({
    sccess: true,
    token,
  });
});

// @desc Get user
// @route POST /api/v1/users/getme
// @access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  //get  user by id from request
  const user = await User.findById(req.user._id);

  //return response with the user
  return res.status(200).json({
    success: true,
    data: user,
  });
});

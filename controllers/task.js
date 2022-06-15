const Task = require("../models/Task");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc Create a new user
// @route POST /api/v1/tasks/create
// @access PRIVATE

exports.create = asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  const user_id = req.user._id;

  //create task
  const task = await Task.create({ title, user_id });
  //send response
  return res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc Get all tasks
// @route Get /api/v1/tasks
// @access PRIVATE

exports.getAll = asyncHandler(async (req, res, next) => {
  let page = 1;
  let limit = 1;
  let now;

  // Get all taks that belongs the user
  let tasks = Task.find({ user_id: req.user._id });
  let total = await Task.countDocuments();

  //check if there page query parameter
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }
  now = page;

  // set the skip
  const skip = (page - 1) * limit;
  const pagination = {};

  // set previous
  if (page > 1) {
    pagination.prev = now - 1;
  }

  // set next
  if (total > page * limit) {
    pagination.next = now + 1;
  }

  tasks = await tasks.skip(skip).limit(limit);

  // Send response
  return res.status(200).json({
    success: true,
    data: tasks,
    count: tasks.length,
    total: total,
    pagination: pagination,
  });
});

// @desc Get single tasks
// @route Get /api/v1/tasks/:taskId
// @access PRIVATE

exports.getSingle = asyncHandler(async (req, res, next) => {
  // Get single task by id
  const task = await Task.find({
    _id: req.params.taskId,
    user_id: req.user._id,
  });

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.taskId}`, 404)
    );
  }

  //send response
  return res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc Update task
// @route PUT /api/v1/tasks/:taskId
// @access PRIVATE

exports.update = asyncHandler(async (req, res, next) => {
  // Two parameters we will updat there is
  const { title, status } = req.body;

  // check we have updating parameters or not at-least one needed
  if (!title && status == null) {
    return next(new ErrorResponse(`Please include a title or status`, 400));
  }

  // get the task by task id and user id and update
  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
      user_id: req.user._id,
    },
    {
      title,
      status,
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc Delete task
// @route Delete /api/v1/tasks/:taskId
// @access PRIVATE

exports.deleteTask = asyncHandler(async (req, res, next) => {
  //find by task id and user id and delete
  const task = await Task.findOneAndDelete({
    _id: req.params.taskId,
    user_id: req.user._id,
  });

  return res.status(200).json({
    success: true,
    data: task,
  });
});

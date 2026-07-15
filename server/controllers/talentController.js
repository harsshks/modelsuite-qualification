const Task = require('../models/Task');

// @desc  Get all available (Open) tasks
// @route GET /api/talent/tasks/available
// @access Talent
const getAvailableTasks = async (req, res) => {
  try {
    // (loose schema allows this inconsistent state from seed data)
    const tasks = await Task.find({ status: 'Open' })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get tasks assigned to the logged-in talent
// @route GET /api/talent/tasks/mine
// @access Talent
const getMyTasks = async (req, res) => {
  try {
    // all come back mixed together with no grouping
    const tasks = await Task.find({ assignedTo: req.user._id })
      .sort({ updatedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Claim an open task
// @route PUT /api/talent/tasks/:id/claim
// @access Talent
const claimTask = async (req, res) => {
  try {
    // Atomic update: only succeeds if the task is still 'Open'
    // This prevents race conditions where two talents claim simultaneously
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, status: 'Open' },
      { status: 'Claimed', assignedTo: req.user._id },
      { new: true }
    );

    if (!task) {
      // Either the task doesn't exist or it was already claimed
      const exists = await Task.findById(req.params.id);
      if (!exists) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(409).json({ message: 'Task is no longer available — it may have been claimed by another talent' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getAvailableTasks, getMyTasks, claimTask };

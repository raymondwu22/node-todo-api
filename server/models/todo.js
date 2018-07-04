const mongoose = require('mongoose');
// create Model
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
});

module.exports = {
  Todo,
};

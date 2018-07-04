const { ObjectId } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// todo.remove({}) - drops our db
Todo.remove({}).then(result => {
  console.log(result);
});

// Todo.findOneAndRemove() & Todo.findByIdAndRemove() - returns doc
Todo.findByIdAndRemove('asd').then(todo => {
  console.log(todo);
});

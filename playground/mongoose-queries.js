const { ObjectId } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// const id = '5b3acc39617bbe0ef33e094f';

// if (!ObjectId.isValid(id)) {
//   console.log('ID Not valid.', id);
// }

// Todo.find({ _id: id }).then(docs => {
//   console.log('Todos', docs);
// });

// Todo.findOne({ _id: id }).then(doc => {
//   console.log('Todo', doc);
// });

// Todo.findById(id)
//   .then(doc => {
//     if (!doc) {
//       return console.log('id not found');
//     }
//     console.log('Todo by Id', doc);
//   })
//   .catch(e => console.log(e));

const id = '5b3a9492cbe2ec05b4d6440b';

User.findById(id)
  .then(doc => {
    if (!doc) {
      return console.log('User not found');
    }
    console.log('User by id', JSON.stringify(doc, undefined, 2));
  })
  .catch(e => console.log(e));

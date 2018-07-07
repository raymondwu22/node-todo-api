const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const todoSeedData = [
  {
    _id: new ObjectId(),
    text: 'First text',
  },
  {
    _id: new ObjectId(),
    text: 'Second text',
    completed: true,
    completedAt: 333,
  },
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => Todo.insertMany(todoSeedData))
    .then(() => done());
};
const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const userSeedData = [
  {
    _id: userOneId,
    email: 'test@test.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
      },
    ],
  },
  {
    _id: userTwoId,
    email: 'test123@test.com',
    password: 'userTwoPass'
  },
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(userSeedData[0]).save();
      const userTwo = new User(userSeedData[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  todoSeedData,
  populateTodos,
  userSeedData,
  populateUsers,
};

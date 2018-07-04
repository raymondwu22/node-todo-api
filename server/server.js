const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

// HEROKU setup
const port = process.env.PORT || 3000;

// Set our middleware
app.use(bodyParser.json());
// Create - POST
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo
    .save()
    .then(doc => {
      res.send(doc);
    })
    .catch(err => res.status(400).send(err));
});

// Read - GET
app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => {
      res.send({ todos });
    })
    .catch(e => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send();
  }
  Todo.findById(req.params.id)
    .then(todo => {
      if (todo) {
        return res.send({ todo });
      }
      return res.status(404).send();
    })
    .catch(e => res.status(400).send());
});

app.listen(port, () => {
  console.log(`App is running on PORT ${port}`);
});

module.exports = {
  app,
};

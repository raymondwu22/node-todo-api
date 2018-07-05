const request = require('supertest');
const expect = require('expect');
const { ObjectId } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');

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

// clear our todos
beforeEach(done => {
  Todo.remove({})
    .then(() => Todo.insertMany(todoSeedData))
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({
        text,
      })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create todo with invalid data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      });
    done();
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todoSeedData[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todoSeedData[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo not found', done => {
    const id = new ObjectId().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for an invalid (non Obj) id', done => {
    const id = '123';

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE todos', () => {
  it('should remove a todo', done => {
    const id = todoSeedData[0]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.doc._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo).toBeNull();
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', done => {
    const id = new ObjectId().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if invalid ObjectID', done => {
    const id = '123';

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH todos', () => {
  it('should update the todo', done => {
    const id = todoSeedData[0]._id.toHexString();

    request(app)
      .patch(`/todos/${id}`)
      .send({ text: 'update text', completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe('update text');
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    const id = todoSeedData[1]._id;

    request(app)
      .patch(`/todos/${id}`)
      .send({ text: 'update text', completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe('update text');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });
});

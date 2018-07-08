const request = require('supertest');
const expect = require('expect');
const { ObjectId } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todoSeedData, populateTodos, userSeedData, populateUsers } = require('./seed/seed');

// clear our todos
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', () => {
  // valid auth token
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', userSeedData[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(userSeedData[0]._id.toHexString());
        expect(res.body.email).toBe(userSeedData[0].email);
      })
      .end(done);
  });
  // no auth token
  it('should return a 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    const email = 'example@example.com';
    const password = '123abcabc';

    request(app)
      .post('/users')
      .send({
        email,
        password,
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then(user => {
            expect(user).toBeDefined();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return validation errors if request invalid', done => {
    const email = 'example1@example.com';

    request(app)
      .post('/users')
      .send({ email })
      .expect(400)
      .end(done);
  });

  it('should not create user if email is already in use', done => {
    const email = 'test@test.com';

    request(app)
      .post('/users')
      .send({ email, password: 'password123' })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({
        email: userSeedData[1].email,
        password: userSeedData[1].password,
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeDefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(userSeedData[1]._id)
          .then(user => {
            expect(user.tokens[0]).toHaveProperty('access', 'auth');
            expect(user.tokens[0]).toHaveProperty('token', res.headers['x-auth']);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: userSeedData[1].email,
        password: 'wrongPassword',
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      });

    User.findById(userSeedData[1]._id)
      .then(user => {
        expect(user.tokens.length).toBe(0);
        done();
      })
      .catch(e => done(e));
  });
});

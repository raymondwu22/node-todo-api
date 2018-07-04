const mongoose = require('mongoose');

// use ES6 Promises
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

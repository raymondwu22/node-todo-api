const env = process.env.NODE_ENV || 'development';
console.log('env *******', env);

if (env === 'development' || env === 'test') {
  const config = require('./config.json');

  // use variable to access property, need bracket notation
  const envConfig = config[env];

  Object.keys(envConfig).forEach(item => {
    process.env[item] = envConfig[item];
  });
}

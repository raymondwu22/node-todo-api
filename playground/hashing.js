const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

const hashedPassword = '$2a$10$Dyq4X.pPUbokqMIIwSBkBOphliVhszSGQoWkRKcK72wbUMczitURi';

bcrypt.compare('abs', hashedPassword, (err, res) => {
  console.log(res);
});
// const data = {
//   id: 4,
// };

// const token = {
//   data,
//   hash: SHA256(`${JSON.stringify(data)}somesecret`).toString(),
// };

// const resultHash = SHA256(`${JSON.stringify(data)}somesecret`).toString();

// token.data.id = 5;
// token.hash = SHA256(`${JSON.stringify(data)}somesecret`).toString();

// if (resultHash === token.hash) {
//   console.log('data not changed');
// } else {
//   console.log('data changed');
// }

// const token = jwt.sign(data, '123abc');
// console.log(token);

// const decoded = jwt.verify(token, '123abc');
// console.log(decoded);


const jwt = require('jsonwebtoken');

const secret = 'your-secret-key';

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
}

module.exports = { generateToken };


const crypto = require('crypto');

const generateSecretKey = (length = 64) => {
    return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateSecretKey();
// console.log('Generated Secret Key:', secretKey);

module.exports = generateSecretKey;

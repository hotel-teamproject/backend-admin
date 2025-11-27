const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

function generateAccessToken(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    return jwt.sign(payload, secret, { expiresIn });
}

function generateRefreshToken(payload) {
    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
    const expiresIn = process.env.REFRESH_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, { expiresIn });
}

module.exports = {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken
};

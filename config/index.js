module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET || 'changeme',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'changeme',
        refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d'
    },
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/backend-admin'
    }
};

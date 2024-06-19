const rateLimit = require('express-rate-limit');

const inviteRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 m
    max: 100, // each IP to 100 por ms
    message: {
        success: false,
        message: 'Too many requests, please try again later',
        data: null
    }
});

module.exports = {
    inviteRateLimiter,
};


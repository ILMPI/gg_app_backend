const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    
    console.log('Verifying token...');
    
    if (!token) {
        console.log('No token provided');
        return res.status(403).send({ message: 'No token provided!' });
    }

    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7).trim() : token;

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.userId = decoded.id;
        console.log('Token verified. User ID:', req.userId);
        next();
    } catch (err) {
        console.log('Token verification failed', err);
        return res.status(401).send({ message: 'Unauthorized!' });
    }
};

module.exports = verifyToken;

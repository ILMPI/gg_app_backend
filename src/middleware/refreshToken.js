const jwt = require('jsonwebtoken');
const verifyUser = require('./verifyUser');

const refreshToken = async (req, res, next) => {
  const token = req.headers['x-refresh-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'No refresh token provided!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userId = decoded.id;

    await verifyUser(req, res, async () => {

      const newAccessToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

      res.status(200).send({
        accessToken: newAccessToken
      });
    });
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized!' });
  }
};

module.exports = refreshToken;

const User = require('../models/users.model');

const verifyUser = async (req, res, next) => {
  try {
    const results = await User.selectById(req.userId);
    const user = results[0];

    if (!user) {
      return res.status(404).send({ message: 'User not found!' });
    }

    if (user.state !== 'Active') {
      return res.status(403).send({ message: 'User account is not active!' });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(500).send({ message: 'Error fetching user data' });
  }
};

module.exports = verifyUser;

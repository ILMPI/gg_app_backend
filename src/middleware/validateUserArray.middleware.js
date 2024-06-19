const validateUserArray = (req, res, next) => {
    const { participants, users } = req.body;
    const invitees = participants || users;

    if (!Array.isArray(invitees)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input format: expected an array of users',
            data: null
        });
    }

    if (invitees.length > 10) {
        return res.status(400).json({
            success: false,
            message: 'Cannot invite more than 10 users at a time',
            data: null
        });
    }

    next();
};

module.exports = {
    validateUserArray,
};

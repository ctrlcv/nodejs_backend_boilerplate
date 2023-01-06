const jwt = require('jsonwebtoken');
const config = require('./../config/dev');

const verifyToken = (req, res, next) => {
    const clientToken = req.headers['x-access-token'] || req.query.token

    if(!clientToken) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    try {
        const decoded = jwt.verify(clientToken, config.secretOrKey);

        if (decoded) {
            res.locals.userId = decoded.user_id;
            next();
        } else {
            res.status(402)
               .json({ error: 'unauthorized' });
        }
    } catch (err) {
        res.status(401)
           .json({ error: 'token expired' });
    }
};

exports.verifyToken = verifyToken;
const basicAuth = require("express-basic-auth");
const jwt = require('jsonwebtoken');


function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRATION_TIME})
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403);

        req.user = user

        next()
    })

    jwt.decode
}

const authMiddleware = basicAuth({
    users: { secure: "login" },
    challenge: true,
    unauthorizedResponse:
        "Unauthorized access. Please provide valid credentials.",
});

module.exports = authMiddleware;
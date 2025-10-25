const express = require("express");
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.redirect('/leaderboard');
});

var leaderboardRouter = require('./routes/leaderboard');
app.use("/leaderboard", leaderboardRouter);

app.use("/assets", express.static(__dirname + "/assets"))

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

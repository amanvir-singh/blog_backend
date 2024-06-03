const { client } = require("./init");
const { createUser } = require('./users');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    try {
        const checkUserStmnt = 'SELECT * FROM users WHERE email = $1 OR username = $2';
        const checkUserResult = await client.query(checkUserStmnt, [req.body.email, req.body.username]);
        const info = checkUserResult.rows[0];

        if (info) {
            return res.status(409).json("User Exists");
        }

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const img = req.body.img;

        if (username && email && password) {
            const newUser = await createUser(username, email, password, img);
            if (newUser) {
                return res.status(200).json({ message: 'User created' });
            } else {
                return res.status(400).json({ message: 'Invalid data.' });
            }
        } else {
            return res.status(400).json({ message: 'Missing user data' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function login(req, res) {
    try {
        const checkUserStmnt = 'SELECT * FROM users WHERE username = $1';
        const checkUserResult = await client.query(checkUserStmnt, [req.body.username]);
        const info = checkUserResult.rows[0];

        if (!info || info.length === 0) {
            return res.status(404).json("User does not exist");
        }

        if (req.body.password!== info.password) {
            return res.status(400).json("Username or password incorrect");
        }

        const token = jwt.sign({ id: info.id }, 'mykey');
        const { password,...other } = info;
        res.cookie("access token", token, { sameSite: "none" }).status(200).json(other);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function logout(req, res) {
    res.clearCookie("access token", { sameSite: "none" }).status(200).json("User logged out.");
}

module.exports = {
    register,
    login,
    logout
};

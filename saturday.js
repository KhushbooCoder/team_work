const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = "1456";

app.use(express.json());

// Generate Token


app.get('/getToken', (req, res) => {

    const token = jwt.sign(
        { name: "Raman" },
        secretKey,
        { expiresIn: "1h" }
    );
    res.status(200).json({ token });
});

//  verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const bt = authHeader.split(' ');

    console.log("bt : " + bt);
    console.log("key : " + bt[0]);
    console.log("value : " + bt[1]);
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = decoded;
        next();
    });
};

// Get Profile
app.get('/profile', verifyToken, (req, res) => {
    res.json({
        message: "This is your profile",
        user: req.user
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});
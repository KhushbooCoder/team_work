const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const secrateKey = "123456";

app.use(express.json());

const token = jwt.sign(
    { "name": "Sita" },
    secrateKey,
    { expiresIn: "100h" }

);

app.get('/getToken', (request, response) => {
    response.status(200).json({
        token: token
    })
});

app.get('/profile', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    jwt.verify(token, secrateKey, (err, result) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        else {
            res.json({ message: "This is your profile", result });
        }
    })
})


app.listen(3000, () => {
    console.log("3000 Server is Running...");
})
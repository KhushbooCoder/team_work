// Q .   At first make register page with name,email,password field and then make a login page with email,password where you have 
// to generate token and with the help of token you have to get the profile of data(users).......


const express=require('express');
const jwt = require('jsonwebtoken');
const app=express();
const db=require('./db');
const  JWT_secret = "34524";
app.use(express.json());


 app.post('/register/students', (request, response) => {
    const { name, email, password } = request.body;
    const sqlQ = "INSERT INTO students (name,email,password) VALUES (?,?,?)";
    db.query(sqlQ, [name, email, password], (error, result) => {
        if (error) {
            response.status(500).json({
                message: "Server Internal Error" + error
            })
        }
        response.status(201).json({
            message: "Student Register Successfully"

        })

    })
})


app.post('/login/students', (request, response) => {

    const { email, password } = request.body;

    const sqlQ = "SELECT * FROM students WHERE email=? AND password=?";

    db.query(sqlQ, [email, password], (error, result) => {

        if (error) {
            return response.status(500).json({
                message: "Server Internal Error"
            });
        }

        if (result.length === 0) {
            return response.status(401).json({
                message: "Invalid email or password"
            });
        }
        const students = result[0];


    const token = jwt.sign(
     { id: students.id, name: students.name, email: students.email },
        JWT_secret,
        { expiresIn: "24h" }
    );
    response.status(200).json({ token });

        return response.status(200).json({
            message: "User Login Successfully"
            
        });

    });
});



//  verify token
const verifyToken = (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const bt = authHeader.split(' ');

    console.log("bt : " + bt);
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, JWT_secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        request.students = decoded;
        next();
    });
};


// get profile

app.get('/profile', verifyToken, (request, response) => {
    response.json({
        message: "This is your profile",
        student: request.students
    });
});



app.listen(4000,()=>{
  console.log("server is running....")
})
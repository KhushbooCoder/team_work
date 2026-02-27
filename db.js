const mysql=require('mysql2');
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"khushboo@841460",
    database:"school",
})
db.connect((error)=>{
    if(error){
        console.log("Database Connection failed"+error)
    }
    else{
        console.log("Database connected successfully.")
    }
})
module.exports=db;
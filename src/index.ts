// const express = require("express") //before ES5
import express from 'express'
import bodyParser from "body-parser";
import * as mongoose from 'mongoose'

interface User{
    id: string,
    username: string,
    lName: string,
    fName: string,
    email: string
}

let users:User[] = [];


//invoke the express
const app= express();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/blog").then(r => {
    console.log(`DB Connection Successfully`)
}).catch(error => {
    console.log(`DB Connection Error : ${error}`)
})
const db= mongoose.connection

// db.on('error', (error) => {
//     console.error(`DB Connection Error: ${error}`);
// });
//
// db.on('open', () => {
//     console.log('DB Connection Opened');
// });
//
// db.on('close', () => {
//     console.log('DB Connection Closed');
// });


//node-->routs (end-point)
app.get('/user/all',(req :express.Request ,res :express.Response) =>{

    res.send(users);
})

app.post('/user',(req, res)=>{

    users.push(req.body);
    res.send("OK!")
})



//start the server
app.listen(8080,() =>{
    console.log("server started on port 8080")
})

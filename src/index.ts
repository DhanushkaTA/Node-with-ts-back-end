// const express = require("express") //before ES5
import express from 'express'
import bodyParser from "body-parser";
import * as mongoose from 'mongoose'

import UserModel from "./models/user.model";

// interface User{
//     id: string,
//     username: string,
//     lName: string,
//     fName: string,
//     email: string
// }
//
// let users:User[] = [];


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

    // res.send(users);
})

app.post('/user',async (req, res)=>{

    // users.push(req.body);
    let user = req.body;

    const userModel = new UserModel({
        username:user.username,
        fName:user.fName,
        lName:user.lName,
        email:user.email,
        password:user.password
    })

    console.log(userModel)

    await userModel.save()

    res.status(200).send("User created successfully")
})



//start the server
app.listen(8080,() =>{
    console.log("server started on port 8080")
})

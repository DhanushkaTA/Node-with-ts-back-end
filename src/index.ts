// const express = require("express") //before ES5
import express from 'express'
import bodyParser from "body-parser";
import * as mongoose from 'mongoose'

//import models
import UserModel from "./models/user.model";
import {CustomResponse} from "./dtos/custom.response";

//invoke the express
const app= express();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/blog").then(r => {
    console.log(`DB Connection Successfully`)
}).catch(error => {
    console.log(`DB Connection Error : ${error}`)
})

// const db= mongoose.connection
//
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
app.get('/user/all',async (req :express.Request ,res :express.Response) =>{

    try {
        let userList = await UserModel.find();
        res.status(200).send(
            new CustomResponse(
                200,
                "Users are found successfully!",
                userList
            )
        );
    } catch (error){
        res.status(100).send("Error");
    }
})

app.post('/user',async (req, res)=>{

    try {

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
        userModel.password="";
        res.status(200).send(
            new CustomResponse(
                200,"User created successfully",userModel
            )
        );

    }catch (error) {
        res.status(100).send("Error")
    }

})



//start the server
app.listen(8080,() =>{
    console.log("server started on port 8080")
})

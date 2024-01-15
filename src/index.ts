// const express = require("express") //before ES5
import express from 'express'
import bodyParser from "body-parser";
import * as mongoose from 'mongoose'
import {ObjectId} from "mongodb";

//import models
import UserModel from "./models/user.model";
import {CustomResponse} from "./dtos/custom.response";
import ArticleModel from "./models/article.model";
import {Schema} from "mongoose";

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


// <---------------------------- Uer --------------------------------->
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

app.post("/user/auth",async (req, res) => {

    try {

        let request_body = req.body;

        let user = await UserModel.findOne({email: request_body.email});

        if(user){
            if (user.password == request_body.password) {
                res.status(200).send(
                    new CustomResponse(
                        200,
                        "Access",
                        user
                    )
                )
            } else {
                res.status(401).send(
                    new CustomResponse(
                        401, "Invalid password"
                    )
                )
            }
        }else {
            res.status(404).send(
                new CustomResponse(
                    404, "User not found!"
                )
            )
        }

    }catch (error){
        res.status(100).send(
            new CustomResponse(
                100, "Error"
            )
        )
    }
})

// <---------------------------- Article --------------------------------->

app.post("/article",async (req, res) =>{

    try {
        let request_body = req.body;

        const articleModel = new ArticleModel({
            title: request_body.title,
            description: request_body.description,
            user: new ObjectId(request_body.user)
        })

        await articleModel.save().then( msg =>{
            //if success
            res.status(200).send(
                new CustomResponse(
                    200,"Article successfully saved!")
            )
        }).catch(error => {
            //an occur error
            res.status(100).send(
                new CustomResponse(100, `Something went wrong : ${error}`)
            )
        })


    }catch (error) {
        res.status(100).send(
            new CustomResponse(100, "Error")
        )
    }
})

app.get("/articles/all",async (req, res) => {
    try {
        let query_string :any = req.query;

        let size :number = query_string.size;
        let page :number = query_string.page;

        let totalDocuments :number = await ArticleModel.countDocuments();
        let totalPages :number = Math.ceil(totalDocuments / size);

        let articles =await ArticleModel.find().limit(size).skip(size * (page - 1));

        res.status(200).send(
            new CustomResponse(
                200,
                "Articles found",
                articles,
                totalPages
            )
        )
    }catch (error) {
        res.status(100).send(
            new CustomResponse(100,`Error : ${error}`)
        )
    }

})

app.get('/articles/:username',async (req, res) => {

    try {
        // console.log(req.params)
        let username=req.params.username;

        let user = await UserModel.findOne({username: username});

        if (!user){
            res.status(404).send(
                new CustomResponse(404,"User not found!")
            )
        }else {
            let query_string :any=req.query;
            let size :number = query_string.size;
            let page :number = query_string.page;

            //@ts-ignore
            let totalDocument :number=ArticleModel.countDocuments({user:user._id});
            let totalPages=Math.ceil(totalDocument / size)

            let articles = await ArticleModel.find({user:user._id}).limit(size).skip(size * (page - 1));

            res.status(200).send(
                new CustomResponse(
                    200,
                    "Articles found successfully",
                    articles,
                    totalPages
                )
            )
        }

    } catch (error){
        res.status(100).send(
            new CustomResponse(100,`Error : ${error}`)
        )
    }
})

//start the server
app.listen(8080,() =>{
    console.log("server started on port 8080")
})
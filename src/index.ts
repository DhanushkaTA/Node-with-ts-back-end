import dotenv from 'dotenv'
dotenv.config();

// const express = require("express") //before ES5
import express, {NextFunction} from 'express'
import bodyParser from "body-parser";
import * as mongoose from 'mongoose'
import {ObjectId} from "mongodb";

//import models
import {CustomResponse} from "./dtos/custom.response";
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken'
import * as SchemaTypes from "../src/types/SchemaTypes"
import UserModel from "./models/user.model";
import ArticleModel from "./models/article.model";

import UserRoutes from "./routes/user.routes";
import ArticleRoutes from "./routes/article.routes";

//invoke the express
const app= express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL as string).then(r => {
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

app.use('/user',UserRoutes);

// <---------------------------- Article --------------------------------->

app.use('/article',ArticleRoutes);

//start the server
app.listen(8080,() =>{
    console.log("server started on port 8080")
})
import dotenv from 'dotenv'
dotenv.config();

// const express = require("express") //before ES5
import express, {NextFunction} from 'express'
import bodyParser from "body-parser";
import * as mongoose from 'mongoose'
import {ObjectId} from "mongodb";

//import models
import UserModel from "./models/user.model";
import {CustomResponse} from "./dtos/custom.response";
import ArticleModel from "./models/article.model";
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken'

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

                user.password="";

                const expiresIn = '1w';// 1h , 2h

                // jwt gen
                jwt.sign({user}, process.env.SECRET as Secret,{expiresIn},(error :any,token :any) => {

                    if (error) {
                        res.status(100).send(
                            new CustomResponse(100,"Something went wrong")
                        );
                    }else {

                        let req_body={
                            user: user,
                            accessToken: token
                        }

                        res.status(200).send(
                            new CustomResponse(200,"Access",req_body)
                        );
                    }

                })

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

const verifyToken = (req: express.Request, res: any, next: express.NextFunction) => {
//methana res eka any damme response onject ekata api athin data ekak dana nisa
//eka nisa ilaga method eketh res eka any karanna ona

    let authorizationToken= req.headers.authorization;
    // console.log(authorizationToken);

    if (!authorizationToken) {
        return res.status(401).json("Invalid Token");
    }

    try {
        // let verifiedData = jwt.verify(authorizationToken,process.env.SECRET as Secret);
        // res.tokenData = verifiedData;
        res.tokenData = jwt.verify(authorizationToken,process.env.SECRET as Secret);
        next();
    }catch (error) {
        return res.status(401).json("Invalid Token");
    }

}

app.post("/article", verifyToken, async (req, res :any) =>{

    try {
        let request_body = req.body;
        // console.log(res.tokenData)
        let user_id = res.tokenData.user._id;

        const articleModel = new ArticleModel({
            title: request_body.title,
            description: request_body.description,
            user: new ObjectId(user_id)
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

app.get('/article/my', verifyToken, async (req,res: any) =>{

    try {
        let my_id = res.tokenData.user._id;

        let query_string :any=req.query;
        let size :number = query_string.size;
        let page :number = query_string.page;

        let totalDocuments = await ArticleModel.countDocuments({user:my_id});
        let totalPages:number = Math.ceil(totalDocuments / size);

        let my_articles =
            await ArticleModel.find({user:my_id}).limit(size).skip(size * (page - 1));

        res.status(200).json(
            new CustomResponse(
                200,
                "Article found successfully!",
                my_articles,
                totalPages)
        );
    }catch (error){
        res.status(100).send(
            new CustomResponse(100,`Error : ${error}`)
        )
    }
})
//start the server
app.listen(8080,() =>{
    console.log("server started on port 8080")
})
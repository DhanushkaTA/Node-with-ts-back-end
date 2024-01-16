import express from "express";
import UserModel from "../models/user.model";
import {CustomResponse} from "../dtos/custom.response";
import * as SchemaTypes from "../types/SchemaTypes";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";
import bcrypt from "bcryptjs"

//Create user
export const creatUser = async (req :express.Request , res :express.Response)=>{

    try {

        let req_body=req.body;

        bcrypt.hash(req_body.password, 8, async function (err: Error | null, hash: string) {

            const userModel = new UserModel({
                username: req_body.username,
                fName: req_body.fName,
                lName: req_body.lName,
                email: req_body.email,
                password: hash
            })

            console.log(userModel)

            let user: SchemaTypes.UserInterface | null = await userModel.save();

            if (user) {
                user.password = "";

                res.status(200).send(
                    new CustomResponse(200, "User created successfully", user)
                );
            } else {
                res.status(100).send("Something went wrong")
            }

        })


    }catch (error) {
        res.status(100).send("Error")
    }

}

//Get All users
export const getAllUsers = async (req :express.Request ,res :express.Response) =>{

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
}

//Auth
export const authUser = async (req :express.Request, res :express.Response) => {

    try {

        let request_body = req.body;

        let user = await UserModel.findOne({email: request_body.email});

        if(user){

            let isMache = await bcrypt.compare(request_body.password, user.password)
                .catch((error) => {
                res.status(100).send(
                    new CustomResponse(100,`Something went wrong : ${error}`)
                );
            });

            if (isMache) {

                user.password="";
                const expiresIn = '1w'; // 1h , 2h

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
                    new CustomResponse(401, "Invalid password")
                )
            }
        }else {
            res.status(404).send(
                new CustomResponse(404, "User not found!")
            )
        }

    }catch (error){
        res.status(100).send(
            new CustomResponse(100, "Error")
        )
    }
}
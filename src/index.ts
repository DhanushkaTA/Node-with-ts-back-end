// const express = require("express") //before ES5
import express from 'express'
import bodyParser from "body-parser";

//invoke the express
const app= express();

app.use(bodyParser.json());

interface User{
    id: string,
    username: string,
    lName: string,
    fName: string,
    email: string
}

let users:User[] = [];

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

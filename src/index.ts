// const express = require("express") //before ES5
import express from 'express'

//invoke the express
const app= express();

//start the server
app.listen(8080,() =>{
    console.log("server started on port 8080")
})

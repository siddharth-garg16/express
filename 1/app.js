const express = require('express');

let app = express();

//ROUTE -> HTTP METHOD + URL
app.get("/", (req, res)=>{
    console.log("request received");
    res.status(200).send("Home"); //could send html and text
    // res.status(200).json({message:"Hello", status:"Active"}); - use json to send json response
})

app.post("/", ()=>{
    //write logic here for post
})

//create server
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server has started");
})
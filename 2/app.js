const express = require('express');
const fs = require('fs');

let app = express();
let movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

//GET - api/movies
app.get("/api/v1/movies", (req, res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{
            movies:movies
        }
    });
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server is running");
})
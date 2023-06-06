const express = require('express');
const fs = require('fs');

let app = express();
app.use(express.json());

let movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

//GET - api/movies(version1)
app.get("/api/v1/movies", (req, res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{
            movies:movies
        }
    });
})

//POST - api/movies(version1)
app.post("/api/v1/movies", (req, res)=>{
    // console.log(req.body);
    const newId = movies[movies.length-1].id + 1;
    let newMovie = Object.assign({id:newId}, req.body);
    movies.push(newMovie);
    fs.writeFile("./movies.json", JSON.stringify(movies), (err)=>{
        res.status(201).json({
            status:"success",
            data:{
                movie:newMovie
            }
        })
    });
    // res.send("Created");
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server is running");
})
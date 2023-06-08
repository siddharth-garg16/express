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

//GET - api/movies/:id(version1) - handling route parameter
app.get("/api/v1/movies/:id/:name?", (req, res)=>{
    // "/api/v1/movies/:id/:name?" - in this case name parameter is optional route parameter and won't raise error if missing and value of it in req.params will be undefined if missing
    // console.log(req.params); - has all route params as its properties
    const id = req.params.id*1; //makes it into number from string

    let requestedMovie = movies.find(movie=>movie.id === id);

    if(requestedMovie){
        res.status(200).json({
            status:"success",
            data: {
                movie:requestedMovie
            }
        })
        return
    }

    res.status(404).json({
        status:"failed",
        message: `Movie with ID ${id} is not found.`
    })
})

//PUT VS PATCH
//in put req, we send the entire updated data that updates the entire resource.
//in patch req, we send the partial updated data that doesn't update the entire resource.
app.patch("/api/v1/movies/:id", (req, res)=>{
    let id = req.params.id*1;
    let movieToUpdate = movies.find(movie=>movie.id===id);
    if(!movieToUpdate){
        return res.status(404).json({
            status:"failed",
            message:"Resource not found"
        })
    }
    let index = movies.indexOf(movieToUpdate);

    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;

    fs.writeFile("./movies.json", JSON.stringify(movies),(err)=>{
        res.status(200).json({
            status:"success",
            data:{
                movie:movieToUpdate
            }
        })
    })
})

//DELETE - api/movies/:id
app.delete("/api/v1/movies/:id", (req, res)=>{

})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server is running");
})
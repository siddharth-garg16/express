const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
//go through the properties available on response and request object from express docs
const logger = (req, res, next)=>{
    console.log("Custom Middleware"); //middle always receive three arguments
    next();
}
//we specified () in other middlewares because they return a function that will work as he middleware
let app = express();
app.use(express.json()); //middleware
app.use(logger); //custom middleware
app.use((req, res, next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})
app.use(morgan('dev')); //third party middleware

let movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

const getAllMovies = (req, res)=>{
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt, //using middle ware here
        count:movies.length,
        data:{
            movies:movies
        }
    });
}

const createMovie = (req, res)=>{
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
}

const getMovie = (req, res)=>{
    const id = req.params.id*1;
    let requestedMovie = movies.find(movie=>movie.id === id);
    if(requestedMovie){
        return res.status(200).json({
            status:"success",
            data: {
                movie:requestedMovie
            }
        })
    }
    res.status(404).json({
        status:"failed",
        message: `Movie with ID ${id} is not found.`
    })
}

const updateMovie = (req, res)=>{
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
}

const deleteMovie = (req, res)=>{
    let id = req.params.id*1;
    let movieToDelete = movies.find(movie=>movie.id===id);
    if(!movieToDelete){
        return res.status(404).json({
            status:"failed",
            message:"Resource not found"
        })
    }
    let index = movies.indexOf(movieToDelete);
    movies.splice(index, 1);
    fs.writeFile("./movies.json", JSON.stringify(movies),(err)=>{
        res.status(200).json({
            status:"success",
            data:{
                movie:movieToDelete
            }
        })
    })
}

//optional route parameters are made like - /:name?
// app.get("/api/v1/movies", getAllMovies);
// app.post("/api/v1/movies", createMovie);
// app.get("/api/v1/movies/:id", getMovie);
// app.patch("/api/v1/movies/:id", updateMovie);
// app.delete("/api/v1/movies/:id", deleteMovie);

app.route("/api/v1/movies")
    .get(getAllMovies)
    .post(createMovie)

app.route("/api/v1/movies/:id")
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server is running");
})
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

// Movie data
let movies = [
    {
        id:1,
        title: 'The Mask',
        director: 'Andrew Hebert',
        releaseYear: '1994',
        genre: 'Comedy'
    }, 
    {
        id:2,
        title: 'Jaws',
        director: 'Steven Spilberg',
        releaseYear: '1975',
        genre: 'Thriller'
    }, 
    {
        id:3,
        title: 'Departed',
        director: 'Martin Scorsese',
        releaseYear: '2006',
        genre: 'Thriller' 
    }, 
    {
        id:4,
        title: 'War',
        director: 'Siddharth Anand',
        releaseYear: '2019',
        genre: 'Thriller'
    }, 
    {
        id:5,
        title: 'Never back down',
        director: 'Jeff Wadlow',
        releaseYear: '2008',
        genre: 'Action Sport'
    }, 
    {
        id:6,
        title: 'Titanic',
        director: 'James Cameron',
        releaseYear: '1997',
        genre: 'Romantic Disaster'
    }, 
    {
        id:7,
        title: 'Avatar',
        director: 'James Cameron',
        releaseYear: '2009',
        genre: 'Fantasy'
    }, 
    {
        id:8,
        title: 'Assassin',
        director: 'Jesse Atlas',
        releaseYear: '2023',
        genre: 'Thriller'
    }, 
    {
        id:9,
        title: 'Animal',
        director: 'Sandeep Reddy Vanga',
        releaseYear: '2023',
        genre: 'Action Drama'
    }, 
    {
        id:10,
        title: 'Father Stu',
        director: 'Rosalind Ross',
        releaseYear: '2022',
        genre: 'Drama'
    }
];

const log = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a',
});

// Middleware
app.use(morgan('combined', { stream: log }));

// Routes for movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:title', (req, res) => {
    res.json(
      movies.find((movie) => {
        return movie.title === req.params.title;
      })
    );
});

app.get('/movies/id/:id', (req, res) => {
    res.json(
      movies.find((movie) => {
        return movie.id === parseInt(req.params.id);
      })
    );
});

app.get('/movies/genres/:genre', (req, res) => {
    res.json(
      movies.filter((movie) => {
        return movie.genre === req.params.genre;
      })
    );
});

app.get('/movies/releaseYear/:releaseYear', (req, res) => {
    res.json(
      movies.filter((movie) => {
        return movie.releaseYear === req.params.releaseYear;
      })
    );
});

app.get('/movies/directors/:director', (req, res) => {
    res.json(
      movies.filter((movie) => {
        return movie.director === req.params.director;
      })
    );
});

// Routes for users
app.get('/users', (req, res) => {
    res.send('Route to list all the users');
});

app.post('/users', (req, res) => {
    res.send('Route to create a new user');
});

app.put('/users/:userName', (req, res) => {
    res.send(`Route to update user name using UserName ${req.params.userName}`);
});

app.delete('/users/:id', (req, res) => {
    res.send(`Route to remove user with ID ${req.params.id} from the list`);
});

app.post('/users/:userName/movies/:title', (req, res) => {
    res.send(`Route to add movie ${req.params.title} to the favorite movies list of user ${req.params.userName}`);
});

app.delete('/users/:userName/movies/:title', (req, res) => {
    res.send(`Route to delete movie ${req.params.title} from the favorite movies list of user ${req.params.userName}`);
});

// Static file
app.use('/documentation', express.static('public', { index: 'documentation.html' }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
    console.log('My first Node test server is running on Port 8080.');
});

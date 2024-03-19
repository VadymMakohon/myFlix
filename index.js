const { error } = require('console');
const express = require('express'),
uuid = require('uuid'),
bodyParser = require('body-parser'),
morgan = require('morgan');
const app = express();

// Logging midleware
app.use(morgan('common'));
app.use(bodyParser.json());

// Movie data
let topTenMovies = [
    {
        id:1,
        title: 'The mask',
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
        genre: 'Triller'
    }, 
    {
        id:4,
        title: 'War',
        director: 'Siddharth Anand',
        releaseYear: '2019',
        genre: 'Triller'
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
        title: 'Assassiin',
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

let myLogger = (req, res, next) => {
    
  app.use(myLogger);
}
// Welcome route

  app.get('/', (req, res) => {
    res.send('Welcome to myFlix API!');
});

// READ   --  Users route
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// CREATE
app.post('/users', (req, res)=>{
    const newUser = req.body;
    if (newUser.name){
        newUser.id = uuid.v4();
        users.push(newUser);

        res.status(201).json(newUser);
    } else{
        res.status(400).send('users need names');
    } 
});

// UPDATE
app.put('/users/:id', (req, res)=>{
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if (user){
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else{
        res.status(400).send('no such user');
    }
});

// CREATE
app.post('/users/:id/:movieTitle', (req, res)=>{
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user){
        user.favoriteMovie.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}\'s array`);
    } else{
        res.status(400).send('no such user');
    }
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res)=>{
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user){
        user.favoriteMovie = user.favoriteMovie.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}\'s array`);
    } else{
        res.status(400).send('no such user');
    }
});

// DELETE
app.delete('/users/:id/', (req, res)=>{
    const { id } = req.params;

    let user = users.find( user => user.id == id);

    if (user){
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else{
        res.status(400).send('no such user');
    }
});

// Movie route
app.get( '/movies', (req, res) => {
    res.status(200).json(topMovies);
});

// READ 
app.get('/movies/:title', (req, res) =>{
    const { title } = req.params;
    const movie = topMovies.find( movie => movie.Title === title );

    if( movie) {
    res.status(200).json(movie);
    } else {
    res.status(400).send('no such title found')
    }
});

// READ 
app.get('/movies/genre/:genre', (req, res) =>{
    const { genre } = req.params;
    const genreName = topMovies.find( movie => movie.Genre === genre ).Title;

    if( genreName) {
    res.status(200).json(genreName);
    } else {
    res.status(400).send('no such genre found')
    }
});

// READ 
app.get('/movies/director/:directorName', (req, res) =>{
    const { directorName } = req.params;
    const director = topMovies.find( movie => movie.Director.Name ===
directorName ).Director;

 if( director) {
    res.status(200).json(director);
    } else {
    res.status(404).send('no such director')
    }
});

//Static file
app.use('/documentation', express.static('public', {index: 'documentation.html'}));

// Error handling midleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
    console.log('My first Node test server is running on Port 8080.');
});

const express = require('express');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

// Logging middleware
app.use(morgan('common'));
app.use(bodyParser.json());

// User data
let users = [
    {
        id: uuid.v4(),
        name: 'Vadym Makohon',
        favoriteMovies: ['The Mask', 'Jaws']
    },
    {
        id: uuid.v4(),
        name: 'Jane Smith',
        favoriteMovies: ['Titanic', 'Avatar']
    },
    // Add more user objects as needed
];

// Movie data
const topMovies = [
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

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to myFlix API!');
});

// READ   --  Users route
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names');
    }
});

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user');
    }
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user');
    }
});

// DELETE
app.delete('/users/:id/', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user');
    }
});

// READ   --  Movies route
app.get('/movies', (req, res) => {
    res.status(200).json(topMovies);
});

// READ 
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find(movie => movie.title.toLowerCase() === title.toLowerCase()); // Case-insensitive search

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such title found');
    }
});

// READ 
app.get('/movies/genre/:genre', (req, res) => {
    const { genre } = req.params;
    const genreMovies = topMovies.filter(movie => movie.genre === genre);

    if (genreMovies.length > 0) {
        res.status(200).json(genreMovies);
    } else {
        res.status(400).send('no movies found for this genre');
    }
});

// READ 
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const directorMovies = topMovies.filter(movie => movie.director === directorName);

    if (directorMovies.length > 0) {
        res.status(200).json(directorMovies);
    } else {
        res.status(404).send('no movies found for this director');
    }
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

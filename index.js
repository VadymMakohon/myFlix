const { error } = require('console');
const express = require('express'),
morgan = require('morgan');
const app = express();

// Logging midleware
app.use(morgan('common'));

// Movie data
let topTenMovies = [
    {
        title: 'The mask',
        director: 'Andrew Hebert'
    }, 
    {
        title: 'Jaws',
        director: 'Steven Spilberg'
    }, 
    {
        title: 'Departures',
        director: 'Yōjirō Takita'
    }, 
    {
        title: 'War',
        director: 'Siddharth Anand'
    }, 
    {
        title: 'Never back down',
        director: 'Jeff Wadlow'
    }, 
    {
        title: 'Titanic',
        director: 'James Cameron'
    }, 
    {
        title: 'Avatar',
        director: 'James Cameron'
    }, 
    {
        title: 'Assassiin',
        director: 'Jesse Atlas'
    }, 
    {
        title: 'Animal',
        director: 'Sandeep Reddy Vanga'
    }, 
    {
        title: 'Father Stu',
        director: 'Rosalind Ross'
    }
];

let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
  };

  app.use(myLogger);

// Welcome route

  app.get('/', (req, res) => {
    res.send('Welcome to cine-verse API!');
});

// Movie route
app.get( '/movies', (req, res) => {
    res.json(topTenMovies);
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

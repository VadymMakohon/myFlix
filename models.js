const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'genres', required: true }
    },
    Director: {
        Name: String,
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'directors', required: true }
    },
    Featured: Boolean,
    image: { type: String, required: true },
});

let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthDate: Date,
    favouriteMovies: [{ type: String, ref: 'Movie' }]

});
// Function to hash password
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// Function to compare hashed passsword
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

let directorSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'directors', required: true },
    Name: { type: String, required: true },
    Bio: { type: String, required: true },
    birthDate: Date,
    DeathDate: Date
})
let genreSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'genre', required: true },
    Name: { type: String, required: true },
    Description: { type: String, required: true }
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Directors', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Movie schema
let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: { type: String, required: true },
        Description: { type: String, required: true },
    },
    Director: {
        Name: { type: String, required: true },
        Bio: { type: String, required: true },
        Birth: { type: Date },
        Death: { type: Date },
    },
    ImagePath: { type: String, required: true }, // Update to include ImagePath
    Featured: Boolean,
});

// Define the User schema
let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthdate: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Reference to Movie schema
});

// Hash the user's password
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// Validate the user's password
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

// Define the Director schema
let directorSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Bio: { type: String, required: true },
    Birth: { type: Date },
    Death: { type: Date },
});

// Define models
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Director = mongoose.model("Director", directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthdate: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Reference to Movie schema
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

let directorSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Bio: { type: String, required: true },
    Birth: { type: Date },
    Death: { type: Date },
});

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Director = mongoose.model("Director", directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;

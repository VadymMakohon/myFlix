const mongoose = require('mongoose');

let movieSchema= mongoose.Schema({ 
    Title: {type: String, required: true}, 
    Description: {type: String, required: true}, 
    Genre: { Name: {String}, Description: {String}, }, 
    Director: { Name: {String}, 
    Bio: {String}, }, Featured: Boolean 
});

let userSchema = mongoose.Schema({
    UserName: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthdate: Date,
    FavoriteMovies: [{type: String, required: true}],  

});

userSchema.statics.hashPassword =(password) => {
    return bcrypt.hashSync(password, 10);
};
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};
let directorSchema = mongoose.Schema({
    Name: {String},
    Bio: {String},
    //Year 
    Birth: {type: Date},
    Death:{type: Date}
})

let Movie =mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Directors', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;

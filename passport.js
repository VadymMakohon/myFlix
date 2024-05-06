const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            try {
                const user = await Users.findOne({ Username: username });
                if (!user) {
                    console.log('Incorrect username');
                    return callback(null, false, { message: 'Incorrect username or password.' });
                }
                if (!user.validatePassword(password)) {
                    console.log('Incorrect password');
                    return callback(null, false, { message: 'Incorrect password.' });
                }
                console.log('Authentication successful');
                return callback(null, user);
            } catch (error) {
                console.error('Error in LocalStrategy:', error);
                return callback(error);
            }
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET // Use environment variable for secret key
        },
        async (jwtPayload, callback) => {
            try {
                const user = await Users.findById(jwtPayload._id);
                return callback(null, user);
            } catch (error) {
                console.error('Error in JWTStrategy:', error);
                return callback(error);
            }
        }
    )
);

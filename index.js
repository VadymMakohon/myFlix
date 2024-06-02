const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  app = express();
const cors = require("cors");
require('dotenv').config();

// Define allowed origins for CORS
let allowedOrigins = [
  'http://localhost:8080',
  'http://testsite.com',
  'http://localhost:1234',
  'https://movie-app-777777.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passport = require("passport");
require("./passport");
app.use(express.static("public"));
app.use(morgan("common"));
const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;
const { check, validationResult } = require("express-validator");

//Database connection
// mongoose.connect("mongodb://localhost:27017/cfDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

// Welcome page
app.get("/", (req, res) => {
  res.send("Hello and welcome to my movie app!");
});

//express to return all static files in public folder
app.use(express.static("public"));

//morgan for logging
app.use(morgan("common"));

const { title } = require("process");
const uuid = require("uuid");
// Import auth routes and apply them
const authRoutes = require("./auth");
authRoutes(app);

// GET users list
app.get(
  "/users/id/:idNumber",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ _id: req.params.idNumber })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// CREATE user
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check("Username", "Username contains non-alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate,
            favoriteMovies: [] // Initialize as an empty array
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error " + error);
      });
  }
);

// UPDATE/PUT user info
app.put(
  "/users/:userid",
  [
    check("Username", "Username is required").notEmpty(),
    check("Username", "Username contains non-alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Password", "Password is required").notEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    await Users.findOneAndUpdate(
      { _id: req.params.userid },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthdate: req.body.Birthdate,
          favoriteMovies: req.body.favoriteMovies // Ensure correct field name
        }
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// CREATE user's Fav movie
app.post(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.username },
      { $push: { FavoriteMovies: req.params.movieId } }, // Ensure movieId is pushed to favoriteMovies array
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// DELETE user by username
app.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndDelete({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          res.status(400).send("user with id " + req.params.id + " was not found");
        } else {
          res.status(200).send("user with id " + req.params.id + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// DELETE Fav movie by moviename
app.delete(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.username },
      { $pull: { FavoriteMovies: req.params.movieId } }, // Ensure movieId is removed from FavoriteMovies array
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// GET all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        console.log(movies)
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// GET movies by title name
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// // GET movie by ID
app.get(
  "/movies/id/:idNumber",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ _id: req.params.idNumber })
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// GET genres from movies
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ genre: req.params.genreName })
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// GET user's favorite movies
app.get(
  "/users/:username/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await Users.findOne({ Username: req.params.username }).populate('FavoriteMovies');
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(user.FavoriteMovies);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

// CREATE a new movie
app.post(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { title, description, genre, director, featured } = req.body;
    try {
      // Find the director's ID based on the director's name
      const directorObject = await Directors.findOne({ name: director });

      if (!directorObject) {
        return res.status(400).json({ message: "Director not found" });
      }
      const newMovie = await Movies.create({
        Title: title,
        Description: description,
        Genre: { name: genre },
        Director: {
          Name: directorObject.Name,
          _id: directorObject._id
        },
        ImagePath: imagePath,
        Featured: featured,
      });

      res.status(201).json(newMovie);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

// GET genres
app.get(
  "/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Genres.findOne({ name: req.params.genreName })
      .then((genre) => {
        res.status(201).json(genre);
      })
      .catch((err) => {
        console.log(err);
        res.send(500).send("Error: " + err);
      });
  }
);

// GET Directors
app.get(
  "/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Directors.findOne({ name: req.params.directorName })
      .then((directors) => {
        res.status(200).json(directors);
      })
      .catch((err) => {
        console.log(err);
        res.send(500).send("Error: " + err);
      });
  }
);

// POST login route
app.post("/login", (req, res) => {
  // Handle user authentication logic here
  const { username, password } = req.body;

  // Example authentication logic (replace this with your actual authentication logic)
  if (username === "example" && password === "password") {
    // Authentication successful
    res.status(200).json({ user: { username: "example" }, token: "fakeToken" });
  } else {
    // Authentication failed
    res.status(401).json({ message: "Invalid username or password" });
  }
});

//Static file
app.use(
  "/documentation",
  express.static("public", { index: "documentation.html" })
);
// Error handling midleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});

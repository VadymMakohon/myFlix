const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  app = express();
const cors = require("cors");
require('dotenv').config();

app.use(cors());
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

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(error => {
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
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(200).json(users);
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
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
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
            Birthdate: req.body.Birthdate
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
  "/users/:username",
  [
    check("Username", "Username is required").notEmpty(),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
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
      { username: req.params.username },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          birthdate: req.body.birthdate,
          favoriteMovie: req.body.favoriteMovie
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
  "/users/:username/movies/:movieName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { username: req.params.username },
      { $push: { favoriteMovies: req.params.movieName } },
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
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndDelete({ username: req.params.username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.username + " was not found");
        } else {
          res.status(200).send(req.params.username + " was deleted.");
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
  "/users/:username/movies/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { favoriteMovies: req.params.name } },
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
        Featured: featured,
        ImageUrl: imageUrl
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

const jwt = require("jsonwebtoken");
const passport = require("passport");
require("./passport");

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variable or fallback to hardcoded secret

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: "7d", // Adjust expiry time based on your requirements
        algorithm: "HS256"
    });
};

module.exports = (router) => {
    router.post("/login", (req, res) => {
        passport.authenticate("local", { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message:
                        "Invalid credentials or something went wrong during authentication.",
                    error: error, // Send error for debugging purposes
                    info: info // Send additional info for debugging purposes
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    return res.status(500).json({ message: "Internal server error" });
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
};

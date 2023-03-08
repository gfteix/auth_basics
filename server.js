require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");
const sessions = require("client-sessions");
const bcrypt = require("bcryptjs")

mongoose.connect(process.env.DATABASE_URI).then(() => {
    console.log("MONGO CONNECTED")
})

let User = mongoose.model("User", new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

}));

let app = express();

app.set("view engine", "pug");

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies using query-string library

app.use(sessions({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000, //30mins
}))

//middleware: checks if user exists, if yes it will fetch the user form mongodb, it 
//will store the user object and store on the req.user
//any feature code can use req.user to access the user
app.use((req, res, next) => {
    if(!(req.session && req.session.userId)) {
        return next();
    }

    User.findById(req.session.userId).then(user => {
        if(!user) {
            return next();
        }

        user.password = undefined;

        req.user = user;
        res.locals.user = user; //allow to access user variable in any html template

        next();
    })
})

function loginRequired(req, res, next) {
    if(!req.user) {
        return res.redirect("/login");
    }

    next();
}

app.get("/", (req, res) => {
  res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register",(req, res) => {
    const user = new User(req.body)
    const hash = bcrypt.hashSync(req.body.password, 14);
    user.password = hash

    user.save().then(value => {
        console.log("Registered Sucessfully")
        req.session.userId = user._id;
        return res.redirect("/dashboard")
    })
    .catch(error => {
        console.log(error)
        let message = "Something bad happened! Please try again"

        if(error.code === 11000) {
            message = "That email is already taken!"
        }
        return res.render("register", { error: message });
    })
})

app.post("/login", (req, res) => {
    console.log(req.body)
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if(!user || !bcrypt.compareSync(req.body.password, user.password)) {
                throw "Incorrect email/password"
            }

            req.session.userId = user._id;
            res.redirect("/dashboard")

        }).catch(error => {
                res.status(401)
                return res.render("login", {
                    error: error
                });
            })
})
        
        
app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/dashboard", loginRequired, (req, res) => {
    res.render("dashboard")
})

app.listen(3000);

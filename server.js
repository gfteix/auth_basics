const express = require('express');
const bodyParser = require("body-parser");
const { urlencoded } = require('body-parser');

let app = express();

app.set("view engine", "pug");

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies using query-string library


//app.use(bodyParser, urlencoded({
//    extended: true
//})); //middleware function
//se if browser sends POST data if yes it makes available as the req.body

//7min 32s
app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register",(req, res) => {
    res.render("dashboard");
    console.log(req.body)
    console.log("HEY")
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})

app.listen(3000);



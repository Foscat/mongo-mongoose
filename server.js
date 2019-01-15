var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser'); // Post Body Request
var logger = require("morgan");
var mongoose = require('mongoose'); // MongoDB ORM
var modals = require("./models");
var request = require('request');
var cheerio = require('cheerio');
var path = require("path");



// Require all models

var PORT = process.env.Port || 3000;

// Initialize Express
var app = express();
// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set Handlebars as templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static(path.join('./public')));

// Import routes and give the server access to them.
require("./controllers/app-controller")(app);
// require("./controllers/notes-controller")(app);

////////////////////////////// Connect to DB \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var mongooseConnection = mongoose.connection;

mongooseConnection.on("error", console.error.bind(console, "Connection error:"));
mongooseConnection.once("open", function() {
  console.log("Articles sucessfully connected to Mongo DB"); // Once connection is successful it tells you in in the console log
});


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
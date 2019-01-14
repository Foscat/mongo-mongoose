var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var path = require("path");
var bodyParser = require('body-parser'); // Post Body Request

// Require all models
var modals = require("./models");
var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

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


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
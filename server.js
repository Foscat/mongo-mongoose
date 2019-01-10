var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var modals = require("./models");
var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/notes-controller");
var artRoutes = require("./controllers/articles-controller");
app.use(routes);
app.use(artRoutes);

// Main route template route
app.get("/", function(req, res) {

  modals.Article.all(function(data) {
    console.log(data);
    var artHbsData = {
      articles: data
    };
  });

  // modals.Note.all(function(data) {
  //   console.log("Data: " + data);
  //   var hbsObject = {
  //     notes: data
  //   };
  // });
  res.render("index", artHbsData);
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
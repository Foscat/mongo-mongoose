// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var models = require("../models");

// Initialize Express
var app = express();
var router = express.Router();

// Database configuration
var databaseUrl = "scraper";
var collections = ["Articles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Retrieve data from the db
router.get("/articles", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.Articles.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
router.get("/scrape", function(req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://news.ycombinator.com/").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class
    $(".title").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.Articles.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
            // res.json(inserted);
          }
          // console.log(inserted);
          // artInfo = {
          //   ArticleSchema: inserted
          // };
          // console.log(artInfo);
        });
      }
    });
  });
  // wrapper for orm.js that using MySQL query callback will return burger_data, render to index with handlebar
  // res.render("index", artInfo);
  db.Articles.find({}, function(error, found) {
    // Throw any errors to the console
    var hbsObj = {
      ArticleSchema: found
    };
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.render("index", hbsObj);
    }
  });
});

 // Clear the DB
 router.get("/clearArticles", function(req, res) {
  // Remove every note from the notes collection
  db.Articles.drop({}, function(error, response) {
    // Log any errors to the console
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      // Otherwise, send the mongojs response to the browser
      // This will fire off the success function of the ajax request
      console.log(response);
      res.redirect("/");
    }
  });
});

module.exports = router;
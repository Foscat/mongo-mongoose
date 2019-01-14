///////////////////////////// Setup requires \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios"); // HTTP request
var cheerio = require("cheerio"); // Scraper
var mongoose = require('mongoose'); // MongoDB ORM
var db = require("../models"); // Get all models


////////////////////////////// Connect to DB \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var mongooseConnection = mongoose.connection;

mongooseConnection.on("error", console.error.bind(console, "Connection error:"));
mongooseConnection.once("open", function() {
  console.log("Articles sucessfully connected to Mongo DB!"); // Once connection is successful it tells you in in the console log
});

module.exports = function(app) {

  //////////////////////////////// Get Routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // Start base route
  app.get("/", function(req, res){
    res.render("index");
  }); // End base route

  // Start scrape data route
  app.get("/articles/scrape", function(req, res) {
  
    // Making a request via axios for infowars "truth". The page's HTML is passed as the callback's third argument
    axios.get("https://www.infowars.com/").then(function(response) {
 
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);
 
      // A handlebars object that holds an empty array to save the data that we'll scrape
      var hbsObj = {
        data: []
      };
 
      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("article").each(function(i, element) {
 
        var title = $(element).find(".article-content").find("h3").find("a").text();
        // Save the text of the element in a "title" variable
        var summary = $(element).find(".article-content").find(".entry-subtitle").text();


        var category = $(element).find(".article-content").find(".category-name").find("span").find("a").text();
 
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = $(element).find(".article-content").find("h3").find("a").attr("href");
 
        var image = $(element).find(".thumbnail").find("a").find("img").attr("src");
        if(image === undefined){
          image = "/images/pepe.jpg";
        }
 
        // Save these results in an object that we'll push into the results array we defined earlier
        hbsObj.data.push({
          title: title,
          summary: summary,
          category: category,
          link: link,
          image: image,
          notes: null
          });
      });
 
      // Log the results once you've looped through each of the elements found with cheerio
      res.render("index", hbsObj);
    });
  }); // End webscrape route


  // Start save article route
  app.get("/articles/saved", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.Articles.find({})
      .then(function(dbArticle){
        res.json(dbArticle);
      })
      .catch(function(err){
        res.json(err);
      });
  }); // End save article route


  ///////////////////////////// Post Routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // Start article post route
  app.post("article/add", function(req, res) {
    var artObj = req.body;

    db.Articles.findOne(
      {link: artObj.link}
      ).then(function(response){
  
        if (response === null) {
  
          db.Articles.create(artObj)
            .then(function(response){
  
              console.log(" ");
              console.log(response);
  
            }).catch(function(err){
              res.json(err);
            });
        }
        res.send("Saved");
      }).catch(function(err){
        res.json(err);
      });
  }); // End article add post route

  // Start article delete route
  app.post("/article/delete", function(req, res) {
    
    var sessionArticle = req.body;

    db.Articles.findByIdAndRemove(sessionArticle._id)
      .then(function(response){
        if(response){
          res.send("Deleted");
        }
      });
  }); // End delete article route

  // Clear the DB
  app.get("/clearArticles", function(req, res) {
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
        res.send(response);
      }
    });
  });

}; //End of export
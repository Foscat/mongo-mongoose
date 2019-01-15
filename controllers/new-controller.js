var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
mongoose.Promise = Promise;
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

module.exports = function(router){
router.get("/", function(req, res) {
    res.render("index");
});
  
router.get("/save", function(req, res) {
    Article.find({}, function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            var hbsArticleObject = {
            articles: doc
            };
            res.render("save", hbsArticleObject);
        }
    });
});


// A GET request to scrape the nytimes website
router.post("/scrape", function(req, res) {
    // grabs the body of content with a request
    request("http://www.nytimes.com/", function(error, response, html) {
      // load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      var scrapedArticles = {};
      $("article").each(function(i, element) {

        var result = {};
        // Get Article title
        result.title = $(element).find(".article-content").find("h3").find("a").text();
        // Save the text of the element in a "title" variable
        result.summary = $(element).find(".article-content").find(".entry-subtitle").text();
        // Get article category
        result.category = $(element).find(".article-content").find(".category-name").find("span").find("a").text();
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        result.link = $(element).find(".article-content").find("h3").find("a").attr("href");
        // Get a image for article. If not is there insert default image
        result.image = $(element).find(".thumbnail").find("a").find("img").attr("src");
        scrape[i] = result;
      });
      console.log("Scraped Articles: ", scrape);
      var hbsArtObj ={articles: scrape};
      // Log the results once looped through each of the elements found with cheerio
      res.render("index", hbsArtObj);
    });
  }); // End webscrape route

};
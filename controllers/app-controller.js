///////////////////////////// Setup requires \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios"); // HTTP request
var cheerio = require("cheerio"); // Scraper
var db = require("../models"); // Get all models




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
      var ScrapedArt = {};
 
      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $(".articles-wrap").each(function(i, element) {
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

        ScrapedArt[i] = result;
      });

      var hbsObj = {
        data: ScrapedArt
    };
      // Log the results once looped through each of the elements found with cheerio
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



////////////////////////////////////// Note Post Routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



    // Start note delete route
    app.post("/notes/delete", function(req, res) {

      var note = req.body;
  
      db.Notes.findByIdAndRemove(note._id)
        .then(function(response) {
          if(response) {
            res.send("Note Deleted");
          }
        });
    }); // End of note delete route
  
    // Start write note route
    app.post("/notes/write", function(req, res) {
  
      var sessionArticle = req.body;
  
      db.Notes.create(sessionArticle.body)
        .then(function(dbNote){
          return db.Articles.findOneAndUpdate({
            _id: sessionArticle.articleID.articleID
          }, {
            $push : {
              note: dbNote._id
            }
          });
        }).then(function(dbArticle) {
          // If note is successfully written send it back to user
          res.json(dbArticle);
        }).catch(function(err) {
          // If error occurs send to client
          res.json(err);
        });
    }); // End write note route
  
    // Start article note grab route
    app.post("/notes/article", function(req, res) {
  
      db.Articles.findOne({_id: req.body.articleID}).populate("Note")
  
        .then(function(response) {
  
          if(response.note.length === 1) {
  
            db.Notes.findOne({"_id": response.note}).then((function(note) {
              note = [note];
              console.log("Sending only note");
              res.json(note);
            }));
          
          }else {
            db.Notes.find({
              "_id": {
                "$in": response.note
              }
            }).then(function(notes) {
              console.log("Sending multiple notes");
              res.json(notes);
            });
          }
        }).catch(function(err) {
          res.json(err);
        });
    });


  ///////////////////////////// Article Post Routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // Start article post route
  app.post("/article/add", function(req, res) {
    var artObj = req.body;

    console.log("Art Obj: ",artObj);
    
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

  // // Clear the DB
  // app.get("/clearArticles", function(req, res) {
  //   // Remove every note from the notes collection
  //   db.Articles.deleteMany({}, function(error, response) {
  //     // Log any errors to the console
  //     if (error) {
  //       console.log(error);
  //       res.send(error);
  //     }
  //     else {
  //       // Otherwise, send the mongojs response to the browser
  //       // This will fire off the success function of the ajax request
  //       console.log(response);
  //       res.send(response);
  //     }
  //   });
  // });

    // Clear the DB
    app.get("/clearArticles", function(req, res) {
      // Remove every note from the notes collection
      db.Article.deleteMany({}, function(error, response) {
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

      // For json format of all notes
app.get("/article/json", function(req, res) {
  db.Article.find({}).then(function(data) {
    console.log(data);
      var hbsObj = {
        NoteSchema: data
      };
      console.log(hbsObj);
      // wrapper for orm.js that using MySQL query callback will return burger_data, render to index with handlebar
      res.json(hbsObj);
    });
});

}; //End of export
var express = require("express");
var router = express.Router();
var models = require("../models");
var mongojs = require("mongojs"); 

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// get route -> index
router.get("/", function(req, res) {
  res.redirect("/notes");
});

// For json format of all notes
router.get("/note/json", function(req, res) {
  models.Note.find({}).then(function(data) {
    console.log(data);
      var hbsObj = {
        NoteSchema: data
      };
      console.log(hbsObj);
      // wrapper for orm.js that using MySQL query callback will return burger_data, render to index with handlebar
      res.json(hbsObj);
    });
});

// to populate main page with notes
router.get("/notes", function(req, res) {
  // console.log(res);
  models.Note.find({}).then(function(data) {
  console.log(data);
    var hbsObj = {
      NoteSchema: data
    };
    console.log(hbsObj);
    // wrapper for orm.js that using MySQL query callback will return burger_data, render to index with handlebar
    res.render("index", hbsObj);
  });
});

// to create a new note
router.post("/notes/create", function(req, res) {
    // takes the request object using it as input for burger.addBurger
    models.Note.create({
      title: req.body.title,
      body: req.body.body
    })
      .then(function(result) {
        // wrapper for orm.js that using MySQL insert callback will return a log to console,
        // render back to index with handle
        console.log("result: " + result);

        hbsObj = {
          NoteSchema: result
        };

        res.json(hbsObj.NoteSchema);
        
      });
    res.redirect("/");
  }); 

  // POST route for saving a new Book to the db and associating it with a Library
app.post("/submit", function(req, res) {
  // Create a new Book in the database
  db.Note.create(req.body)
    .then(function(dbBook) {
      // If a Book was created successfully, find one library (there's only one) and push the new Book's _id to the Library's `books` array
      // { new: true } tells the query that we want it to return the updated Library -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Library.findOneAndUpdate({}, { $push: { books: dbBook._id } }, { new: true });
    })
    .then(function(dbLibrary) {
      // If the Library was updated successfully, send it back to the client
      res.json(dbLibrary);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

  // To delete a note
  router.delete("/notes/delete/:id", function(req, res) {

    console.log("res " + res);
    console.log("req " +req.id);
    models.Note.deleteOne(
      {
        _id: mongojs.ObjectId(req.params.id)
      },
      function(error, removed) {

        if(error) {
          console.log(error);
          res.send(error);
        }
        else {
          console.log(removed);
          res.send(removed);
        }
      }
    );
    
  });

  // Clear the DB
  router.get("/clearNotes", function(req, res) {
    // Remove every note from the notes collection
    models.Note.deleteMany({}, function(error, response) {
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

  module.exports = router;
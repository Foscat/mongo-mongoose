var mongoose = require('mongoose'); // MongoDB ORM
var db = require("../models"); // Get all models


var mongooseConnection = mongoose.connection;

mongooseConnection.on("error", console.error.bind(console, "Connection error:"));
mongooseConnection.once("open", function() {
  console.log("Notes sucessfully connected to Mongo DB"); // Once connection is successful it tells you in in the console log
});


module.exports = function(app) {

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
  app.post("notes/article", function(req, res) {

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

}; // End of export



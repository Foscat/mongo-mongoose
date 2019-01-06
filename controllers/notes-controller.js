var express = require("express");
var router = express.Router();
var models = require("../models");
var mongojs = require("mongojs");

// get route -> index
router.get("/", function(req, res) {
  res.redirect("/notes");
});

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

router.get("/notes", function(req, res) {
  // console.log(res);
  // res.render("index");
  // express callback response by calling burger.selectAllBurger
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

// post route -> back to index
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
    // res.redirect("/");
  });

  // put route -> back to index
  // router.put("/notes/find/:id", function(req, res) {
  //   console.log(_id)
  //   models.Note.findOne(_id).then(function(response){
  //     console.log(result);
  //   });
  // });

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
  router.get("/clearall", function(req, res) {
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
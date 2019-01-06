var express = require("express");
var router = express.Router();
var models = require("../models");

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
router.put("/notes/:id", function(req, res) {
    models.Note.update(req.params.id, function(result) {
      // wrapper for orm.js that using MySQL update callback will return a log to console,
      // render back to index with handle
      console.log(result);
      // Send back response and let page reload from .then in Ajax
      res.sendStatus(200);
    });
  });

  router.delete("/notes/:id", function(req, res) {

    console.log("res " + res);
    console.log("req " +req.id);
    models.Note.delete(req._id, function(result) {
      // wrapper for orm.js that using MySQL update callback will return a log to console,
      // render back to index with handle
      console.log(result);
      // Send back response and let page reload from .then in Ajax
      res.sendStatus(200);
    });
  });

  module.exports = router;
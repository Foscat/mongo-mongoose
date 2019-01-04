var express = require("express");

var router = express.Router();
var note = require("../models/Note.js");

// get route -> index
router.get("/", function(req, res) {
  res.redirect("/notes");
});

router.get("/notes", function(req, res) {
  // express callback response by calling burger.selectAllBurger
  note.all(function(noteData) {
    // wrapper for orm.js that using MySQL query callback will return burger_data, render to index with handlebar
    res.render("index", { body: noteData });
  });
});

// post route -> back to index
router.post("/notes/create", function(req, res) {
    // takes the request object using it as input for burger.addBurger
    note.create(req.body.body, function(result) {
      // wrapper for orm.js that using MySQL insert callback will return a log to console,
      // render back to index with handle
      console.log(result);
      res.redirect("/");
    });
  });

  // put route -> back to index
router.put("/notes/:id", function(req, res) {
    burger.update(req.params.id, function(result) {
      // wrapper for orm.js that using MySQL update callback will return a log to console,
      // render back to index with handle
      console.log(result);
      // Send back response and let page reload from .then in Ajax
      res.sendStatus(200);
    });
  });

  module.exports = router;
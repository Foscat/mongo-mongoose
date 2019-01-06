var express = require("express");
var router = express.Router();
var models = require("../models");

// get route -> index
router.get("/", function(req, res) {
  res.redirect("/notes");
});

router.get("/notes", function(req, res) {
  // console.log(res);
  // res.render("index");
  // express callback response by calling burger.selectAllBurger
  models.Note.find({}).then(function(data) {
  console.log(data);
    var hbsObj = {
      notes: data
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
        res.render("index", { body: result });
        
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

  router.delete("/notes", function(req, res) {

    console.log(req);
  //   models.Note.delete(req._id, function(result) {
  //     if(result.affectedRows == 0) {
  //       res.status(404).end();
  //     } else {
  //       res.status(200).end();
  //     }
  //     // wrapper for orm.js that using MySQL update callback will return a log to console,
  //     // render back to index with handle
  //     console.log(result);
  //     // Send back response and let page reload from .then in Ajax
  //     res.sendStatus(200);
  //   });
  });

  module.exports = router;
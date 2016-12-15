var express = require("express");
var router  = express.Router();
var Udemy = require("../models/udemy");
var middleware = require("../middleware");


//INDEX - show all udemy
router.get("/", function(req, res){
    // Get all udemy from DB
    Udemy.find({}, function(err, allUdemy){
       if(err){
           console.log(err);
       } else {
          res.render("udemy/index",{udemy:allUdemy});
       }
    });
});

//CREATE - add new udemy to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to udemy array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newUdemy = {name: name, image: image, description: desc, author:author}
    // Create a new udemy and save to DB
    Udemy.create(newUdemy, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to udemy page
            console.log(newlyCreated);
            res.redirect("/udemy");
        }
    });
});

//NEW - show form to create new udemy
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("udemy/new");
});

// SHOW - shows more info about one udemy
router.get("/:id", function(req, res){
    //find the udemy with provided ID
    Udemy.findById(req.params.id).populate("comments").exec(function(err, foundUdemy){
        if(err){
            console.log(err);
        } else {
            console.log(foundUdemy)
            //render show template with that udemy
            res.render("udemy/show", {udemy: foundUdemy});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkUdemyOwnership, function(req, res){
    Udemy.findById(req.params.id, function(err, foundUdemy){
        res.render("udemy/edit", {udemy: foundUdemy});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkUdemyOwnership, function(req, res){
    // find and update the correct udemy
    Udemy.findByIdAndUpdate(req.params.id, req.body.udemy, function(err, updatedUdemy){
       if(err){
           res.redirect("/udemy");
       } else {
           //redirect somewhere(show page)
           res.redirect("/udemy/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkUdemyOwnership, function(req, res){
   Udemy.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/udemy");
      } else {
          res.redirect("/udemy");
      }
   });
});


module.exports = router;

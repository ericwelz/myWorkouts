var express = require('express');
var async = require('async');
var router = express.Router();

/* POST main exercises page. */
router.post('/', function(req, res, next) {
    var db = req.db;
    var exerCollection = db.get('exercises');
    var groupsCollection = db.get('groupscollection');
    var filterval = req.body.filter;
    console.log("filterval = " + filterval);
    var locals = {};
    var filter = {};
    
    if (filterval !== 'nofilter'){
    	filter = {primarymsclgrp : filterval};
    }
    
    var tasks = [
        // Load exercises
        function(callback) {
        	exerCollection.find(filter, function(e,exdocs){
        		locals.exdocs = exdocs;
                callback();
            });
        },
        // Load groups
        function(callback) {
        	groupsCollection.find({},function(e,grpdocs){
        		locals.grpdocs = grpdocs;
                callback();
            });
        }
    ];
    
    async.parallel(tasks, function(err) {
        res.render('exercises', {
        	title: 'Exercises',
        	"groups" : locals.grpdocs,
        	"exercises" : locals.exdocs
        });
    });
});


/* POST to Add Exercise Service */
router.post('/addexercise', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var description = req.body.description;
    var primarymsclgrp = req.body.primarymsclgrp;
    var secondarymsclgrp = req.body.secondarymsclgrp;

    // Set our collection
    var collection = db.get('exercises');

    // Submit to the DB
    collection.insert({
        "name" : name,
        "description" : description,
        "primarymsclgrp" : primarymsclgrp,
        "secondarymsclgrp" : secondarymsclgrp
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/exercises");
        }
    });
});

/* POST to Delete muscle group Service */
router.post('/delexercise', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var delname = req.body.delname;

    // Set our collection
    var collection = db.get('exercises');

    // Remove from the DB
    collection.remove({
        name : delname
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem removing the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/exercises");
        }
    });
});


module.exports = router;

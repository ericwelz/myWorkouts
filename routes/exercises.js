var express = require('express');
var async = require('async');
var router = express.Router();
const util = require('util');

router.get('/', function(req, res, next) {
	var db = req.db;
    var exerCollection = db.get('exercises');
    var groupsCollection = db.get('groupscollection');  //create a filter to exclude documents where the value of the "filter" parameter is "filter"
    
    
    function getFilter(callback1, callback2){
        exerCollection.findOne({"filter" : "filter"}, function(e, fd){
        	callback1(fd, callback2)
        });
    }
 
    
    function setFilter(filt, callback){
        var filter = {filter : {$ne : "filter"}};
        console.log("one: " + util.inspect(filt, false, null, true /* enable colors */));
        if (filt.primarymsclgrp !== "nofilter"){
            filter = {$and : [{"primarymsclgrp" : filt.primarymsclgrp}, {filter : {$ne : "filter"}}]};
        }
        console.log("two" + util.inspect(filter, false, null, true /* enable colors */));
        callback(filter);
    }

    function getDocsAndRender(filter){
        var locals = {};
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
    }
    
    getFilter(setFilter, getDocsAndRender);
        
});

/* POST main exercises page. */
router.post('/', function(req, res, next) {
    var db = req.db;
    var exerCollection = db.get('exercises');
    var filterval = req.body.filter;
    console.log("post filterval = " + filterval);
    
    
 // Submit to the DB
    exerCollection.update(
    	{"filter" : "filter"},
    	{"filter" : "filter", "primarymsclgrp" : filterval},
    	{upsert : true}
    , function (err, doc) {
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

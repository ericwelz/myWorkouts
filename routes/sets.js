var express = require('express');
var async = require('async');
var router = express.Router();


router.get('/', function(req, res, next) {
	var db = req.db;
    var exerCollection = db.get('exercises');
    var groupsCollection = db.get('groupscollection');
    var setsCollection = db.get('sets');
    var filterval = 'nofilter';
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
        },
        // Load sets
        function(callback) {
        	setsCollection.find({},function(e,setdocs){
        		locals.setdocs = setdocs;
                callback();
            });
        }
    ];
    
    async.parallel(tasks, function(err) {
        res.render('sets', {
        	title: 'Sets',
        	"groups" : locals.grpdocs,
        	"exercises" : locals.exdocs,
        	"sets" : locals.setdocs
        });
    });
});


/* POST main sets page. */
router.post('/', function(req, res, next) {
    var db = req.db;
    var exerCollection = db.get('exercises');
    var groupsCollection = db.get('groupscollection');
    var setsCollection = db.get('sets');
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
        },
        // Load sets
        function(callback) {
        	setsCollection.find({},function(e,setdocs){
        		locals.setdocs = setdocs;
                callback();
            });
        }
    ];
    
    async.parallel(tasks, function(err) {
        res.render('sets', {
        	title: 'Sets',
        	"groups" : locals.grpdocs,
        	"exercises" : locals.exdocs,
        	"sets" : locals.setdocs
        });
    });
});


/* POST to Add Set Service */
router.post('/addset', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var date = req.body.date;
    var name = req.body.exerciseName;
    var setnum = req.body.setnum;
    var weight = req.body.weight;
    var reps = req.body.reps;
    var finishtime = req.body.finishtime;

    // Set our collection
    var collection = db.get('sets');

    // Submit to the DB
    collection.insert({
        "date" : date,
        "exercise" : name,
        "setNumber" : setnum,
        "weight" : weight,
        "reps" : reps,
        "finishtime" : finishtime
        
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/sets");
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

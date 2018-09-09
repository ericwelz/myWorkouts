var express = require('express');
var router = express.Router();

/* GET muscle groups page. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('groupscollection');
    collection.find({},{},function(e,docs){
        res.render('muscleGroups', {
        	title: 'Muscle Groups',
        	"musclegroups" : docs
        });
    });
});

/* POST to Add muscle group Service */
router.post('/addmusclegroup', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var description = req.body.description;

    // Set our collection
    var collection = db.get('groupscollection');

    // Submit to the DB
    collection.insert({
        "name" : name,
        "description" : description
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/muscleGroups");
        }
    });
});

/* POST to Delete muscle group Service */
router.post('/delmusclegroup', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var delname = req.body.delname;

    // Set our collection
    var collection = db.get('groupscollection');

    // Remove from the DB
    collection.remove({
        name : delname
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/muscleGroups");
        }
    });
});


module.exports = router;

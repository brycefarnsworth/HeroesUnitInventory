var Town = require('../models/town');
var Unit = require('../models/unit');

var async = require('async');

const { body, validationResult } = require('express-validator');

const alignment_options = ['Good', 'Neutral', 'Evil'];

exports.index = function(req, res) {
    async.parallel({
        town_count: function(callback) {
            Town.countDocuments({}, callback);
        },
        unit_count: function(callback) {
            Unit.countDocuments({}, callback);
        },
        units_available: function(callback) {
            Unit.find({}, 'available').exec(callback);
        }
    }, function(err, results) {
        let total_available = 0;
        results.units_available.forEach(unit => {
            total_available += unit.available;
        });
        res.render('index', {title: 'Heroes Unit Inventory Home', error: err, data: results, units_available: total_available });
    });
};

// Display list of all towns.
exports.town_list = function(req, res, next) {
    Town.find()
    .exec(function (err, list_towns) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('town_list', { title: 'Town List', town_list: list_towns });
    });
};

// Display detail page of a specific town.
exports.town_detail = function(req, res, next) {
    async.parallel({
        town: function(callback) {
            Town.findById(req.params.id)
              .exec(callback)
        },
        towns_units: function(callback) {
          Unit.find({ 'town': req.params.id },'name available')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.town==null) { // No results.
            var err = new Error('Town not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('town_detail', { title: 'Town Detail', town: results.town, town_units: results.towns_units } );
    });
};

// Display Town create form on GET.
exports.town_create_get = function(req, res, next) {
    res.render('town_form', { title: 'Create Town', alignment_options: alignment_options });
};

// Handle Town create on POST.
exports.town_create_post = [

    // Validate and santize the name field.
    body('name', 'Town name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Town description required').trim().isLength({ min: 1 }).escape(),
    body('alignment', 'Town alignment must be Good, Neutral, or Evil').trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a town object with escaped and trimmed data.
      var town = new Town(
        { name: req.body.name,
          description: req.body.description,
          alignment: req.body.alignment }
      );
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('town_form', { title: 'Create Town', town: town, alignment_options: alignment_options, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Town with same name already exists.
        Town.findOne({ 'name': req.body.name })
          .exec( function(err, found_town) {
             if (err) { return next(err); }
  
             if (found_town) {
               // Town exists, redirect to its detail page.
               res.redirect(found_town.url);
             }
             else {
               town.save(function (err) {
                 if (err) { return next(err); }
                 // Town saved. Redirect to town detail page.
                 res.redirect(town.url);
               });
             }
           });
      }
    }
  ];

// Display Town delete form on GET.
exports.town_delete_get = function(req, res, next) {
    async.parallel({
        town: function(callback) {
            Town.findById(req.params.id).exec(callback)
        },
        towns_units: function(callback) {
          Unit.find({ 'town': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.town==null) { // No results.
            res.redirect('/inventory/towns');
        }
        // Successful, so render.
        res.render('town_delete', { title: 'Delete Town', town: results.town, town_units: results.towns_units } );
    });
};

// Handle Town delete on POST.
exports.town_delete_post = function(req, res) {
    async.parallel({
        town: function(callback) {
          Town.findById(req.body.townid).exec(callback)
        },
        towns_units: function(callback) {
          Unit.find({ 'town': req.body.townid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.towns_units.length > 0) {
            // Town has units. Render in same way as for GET route.
            res.render('town_delete', { title: 'Delete Town', town: results.town, town_units: results.towns_units } );
            return;
        }
        else {
            // Town has no units. Delete object and redirect to the list of towns.
            Town.findByIdAndRemove(req.body.townid, function deleteTown(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/inventory/towns')
            })
        }
    });
};

// Display Town update form on GET.
exports.town_update_get = function(req, res, next) {
    Town.findById(req.params.id, function (err, town) {
        if (err) { return next(err); }
        if (town == null) {
            var err = new Error('Town not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('town_form', { title: 'Update Town', town: town, alignment_options: alignment_options });
    });
};

// Handle Town update on POST.
exports.town_update_post = [
    // Validate and santize the name field.
    body('name', 'Town name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Town description required').trim().isLength({ min: 1 }).escape(),
    body('alignment', 'Town alignment must be Good, Neutral, or Evil').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Unit object with escaped/trimmed data and old id.
        var town = new Town(
            { name: req.body.name,
              description: req.body.description,
              alignment: req.body.alignment,
              _id: req.params.id
            });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('town_form', { title: 'Create Town', town: town, alignment_options: alignment_options, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Town.findByIdAndUpdate(req.params.id, town, {}, function (err, thetown) {
                if (err) { return next(err); }
                   // Successful - redirect to town detail page.
                   res.redirect(thetown.url);
                });
        }
    }
];
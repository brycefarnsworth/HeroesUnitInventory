var Unit = require('../models/unit');
var Town = require('../models/town');

const async = require('async');

const { body, validationResult } = require('express-validator');

// Display list of all units.
exports.unit_list = function(req, res, next) {
    Unit.find()
    .populate('town')
    .exec(function (err, list_units) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('unit_list', { title: 'Unit List', unit_list: list_units });
    });
};

// Display detail page of a specific unit.
exports.unit_detail = function(req, res, next) {
    Unit.findById(req.params.id)
      .populate('town')
      .exec(function(err, unit) {
          if (err) { return next(err); }
          if (unit == null) {
              var err = new Error('Unit not found');
              err.status = 404;
              return next(err);
          }
          res.render('unit_detail', {title: unit.name, unit: unit});
      });
};

// Display Unit create form on GET.
exports.unit_create_get = function(req, res, next) {
    // Get all towns, which we can use for adding to our unit.
    Town.find().exec(function (err, towns) {
        if (err) { return next(err); }
        res.render('unit_form', { title: 'Create Unit', towns: towns });
    });
};

// Handle Unit create on POST.
exports.unit_create_post = [
    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('town', 'Town must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be greater than or equal to 0.').isInt({ min: 0 }),
    body('available', 'Number available must be greater than or equal to 0.').isInt({ min: 0 }),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Unit object with escaped and trimmed data.
        var unit = new Unit(
          { name: req.body.name,
            description: req.body.description,
            town: req.body.town,
            price: req.body.price,
            available: req.body.available
          });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all towns for form.
            Town.find().exec(function (err, towns) {
                if (err) { return next(err); }
                res.render('unit_form', { title: 'Create Unit', towns: towns, unit: unit, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save unit.
            unit.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new unit record.
                   res.redirect(unit.url);
                });
        }
    }
];

// Display Unit delete form on GET.
exports.unit_delete_get = function(req, res, next) {
    Unit.findById(req.params.id).exec(function (err, unit) {
        if (err) { return next(err); }
        if (unit == null) { // No results
            res.redirect('/inventory/units');
        }
        // Successful, so render.
        res.render('unit_delete', {title: 'Delete Unit', unit: unit});
    });
};

// Handle Unit delete on POST.
exports.unit_delete_post = function(req, res, next) {
    Unit.findByIdAndRemove(req.body.unitid, function deleteUnit(err) {
        if (err) { return next(err); }
        // Success - go to bookinstance list.
        res.redirect('/inventory/units');
    });
};

// Display Unit update form on GET.
exports.unit_update_get = function(req, res, next) {
    // Get unit and towns for form.
    async.parallel({
        unit: function(callback) {
            Unit.findById(req.params.id).populate('town').exec(callback);
        },
        towns: function(callback) {
            Town.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.unit==null) { // No results.
            var err = new Error('Unit not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('unit_form', { title: 'Update Unit', towns: results.towns, unit: results.unit });
    });
};

// Handle Unit update on POST.
exports.unit_update_post = [
    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('town', 'Town must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be greater than or equal to 0.').isInt({ min: 0 }),
    body('available', 'Number available must be greater than or equal to 0.').isInt({ min: 0 }),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Unit object with escaped/trimmed data and old id.
        var unit = new Unit(
            { name: req.body.name,
              description: req.body.description,
              town: req.body.town,
              price: req.body.price,
              available: req.body.available,
              _id: req.params.id
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all towns for form.
            Town.find().exec(function (err, towns) {
                if (err) { return next(err); }
                res.render('unit_form', { title: 'Update Unit', towns: towns, unit: unit, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Unit.findByIdAndUpdate(req.params.id, unit, {}, function (err,theunit) {
                if (err) { return next(err); }
                   // Successful - redirect to unit detail page.
                   res.redirect(theunit.url);
                });
        }
    }
];
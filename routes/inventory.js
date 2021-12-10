var express = require('express');
var router = express.Router();

// Require controller modules.
var town_controller = require('../controllers/townController');
var unit_controller = require('../controllers/unitController');

/// TOWN ROUTES ///

// GET inventory home page
router.get('/', town_controller.index);

// GET request for creating a Town.
router.get('/town/create', town_controller.town_create_get);

// POST request for creating a Town.
router.post('/town/create', town_controller.town_create_post);

// GET request for deleting a Town.
router.get('/town/:id/delete', town_controller.town_delete_get);

// POST request for deleting a Town.
router.post('/town/:id/delete', town_controller.town_delete_post);

// GET request for updating a Town.
router.get('/town/:id/update', town_controller.town_update_get);

// POST request for updating a Town.
router.post('/town/:id/update', town_controller.town_update_post);

// GET request for one Town.
router.get('/town/:id', town_controller.town_detail);

// GET request for list of all Towns.
router.get('/towns/', town_controller.town_list);

/// UNIT ROUTES ///

// GET request for creating a Unit.
router.get('/unit/create', unit_controller.unit_create_get);

// POST request for creating a Unit.
router.post('/unit/create', unit_controller.unit_create_post);

// GET request for deleting a Unit.
router.get('/unit/:id/delete', unit_controller.unit_delete_get);

// POST request for deleting a Unit.
router.post('/unit/:id/delete', unit_controller.unit_delete_post);

// GET request for updating a Unit.
router.get('/unit/:id/update', unit_controller.unit_update_get);

// POST request for updating a Unit.
router.post('/unit/:id/update', unit_controller.unit_update_post);

// GET request for one Unit.
router.get('/unit/:id', unit_controller.unit_detail);

// GET request for list of all Units.
router.get('/units/', unit_controller.unit_list);

module.exports = router;
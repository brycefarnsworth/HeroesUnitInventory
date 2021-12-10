#! /usr/bin/env node

console.log('This script populates some test unit and town information to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/heroes_inventory?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Town = require('./models/town');
var Unit = require('./models/unit');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var towns = [];
var units = [];

function townCreate(name, description, alignment, cb) {
  towndetail = { name: name, description: description, alignment: alignment };

  var town = new Town(towndetail);

  town.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Town: ' + town);
    towns.push(town);
    cb(null, town);
  });
}

function unitCreate(name, description, town, price, available, cb) {
  unitdetail = { name: name, description: description, town: town, price: price, available: available };

  var unit = new Unit(unitdetail);

  unit.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Unit: ' + unit);
    units.push(unit);
    cb(null, unit);
  });
}

function createTowns(cb) {
  async.series([
    function(callback) {
      townCreate('Castle', 'Home of Knights and Clerics. Pikemen, Archers, Griffins, Swordsmen, Monks, Cavaliers, and Angels.', 'Good', callback);
    },
    function(callback) {
      townCreate('Rampart', 'Home of Rangers and Druids. Centaurs, Dwarfs, Wood Elves, Pegasi, Dendroid Guards, Unicorns, and Green Dragons.', 'Good', callback);
    },
    function(callback) {
      townCreate('Tower', 'Home of Alchemists and Wizards. Gremlins, Stone Gargoyles, Stone Golems, Magi, Genies, Nagas, and Giants.', 'Good', callback);
    },
    function(callback) {
      townCreate('Fortress', 'Home of Beastmasters and Witches. Gnolls, Lizardmen, Serpent Flies, Basilisks, Gorgons, Wyverns, and Hydras.', 'Neutral', callback);
    },
    function(callback) {
      townCreate('Stronghold', 'Home of Barbarians and Battle Mages. Goblins, Wolf Riders, Orcs, Ogres, Rocs, Cyclops, and Behemoths.', 'Neutral', callback);
    },
    function(callback) {
      townCreate('Conflux', 'Home of Planeswalkers and Elementalists. Pixies, Air, Water, Fire, Earth, Psychic Elementals, and Firebirds.', 'Neutral', callback);
    },
    function(callback) {
      townCreate('Inferno', 'Home of Demoniacs and Heretics. Imps, Gogs, Hell Hounds, Demons, Pit Fiends, Efreeti, and Devils.', 'Evil', callback);
    },
    function(callback) {
      townCreate('Dungeon', 'Home of Overlords and Warlocks. Troglodytes, Harpies, Beholders, Medusas, Minotaurs, Manticores, Red Dragons.', 'Evil', callback);
    },
    function(callback) {
      townCreate('Necropolis', 'Home of Death Knights and Necromancers. Skeletons, Walking Dead, Wights, Vampires, Liches, Black Knights, and Bone Dragons.', 'Evil', callback);
    }
  ],
  // optional callback
  cb)
}

function createUnits(cb) {
  async.series([
    function(callback) {
      unitCreate('Pikeman', 'Attack: 4, Defense: 5', towns[0], 60, 14, callback);
    },
    function(callback) {
      unitCreate('Archer', 'Attack: 6, Defense: 3', towns[0], 100, 9, callback);
    },
    function(callback) {
      unitCreate('Griffin', 'Attack: 8, Defense: 8', towns[0], 200, 7, callback);
    },
    function(callback) {
      unitCreate('Swordsman', 'Attack: 10, Defense: 12', towns[0], 300, 4, callback);
    },
    function(callback) {
      unitCreate('Monk', 'Attack: 12, Defense: 7', towns[0], 400, 3, callback);
    },
    function(callback) {
      unitCreate('Cavalier', 'Attack: 15, Defense: 15', towns[0], 1000, 2, callback);
    },
    function(callback) {
      unitCreate('Angel', 'Attack: 20, Defense: 20', towns[0], 3000, 1, callback);
    },
    function(callback) {
      unitCreate('Centaur', 'Attack: 5, Defense: 3', towns[1], 70, 14, callback);
    },
    function(callback) {
      unitCreate('Dwarf', 'Attack: 6, Defense: 7', towns[1], 120, 8, callback);
    },
    function(callback) {
      unitCreate('Wood Elf', 'Attack: 9, Defense: 5', towns[1], 200, 7, callback);
    },
    function(callback) {
      unitCreate('Pegasus', 'Attack: 9, Defense: 8', towns[1], 250, 5, callback);
    },
    function(callback) {
      unitCreate('Dendroid Guard', 'Attack: 9, Defense: 12', towns[1], 350, 3, callback);
    },
    function(callback) {
      unitCreate('Unicorn', 'Attack: 15, Defense: 14', towns[1], 850, 2, callback);
    },
    function(callback) {
      unitCreate('Green Dragon', 'Attack: 18, Defense: 18', towns[1], 2400, 1, callback);
    },
    function(callback) {
      unitCreate('Gremlin', 'Attack: 3, Defense: 3', towns[2], 30, 16, callback);
    },
    function(callback) {
      unitCreate('Stone Gargoyle', 'Attack: 6, Defense: 6', towns[2], 130, 9, callback);
    },
    function(callback) {
      unitCreate('Stone Golem', 'Attack: 7, Defense: 10', towns[2], 150, 6, callback);
    },
    function(callback) {
      unitCreate('Mage', 'Attack: 11, Defense: 8', towns[2], 350, 4, callback);
    },
    function(callback) {
      unitCreate('Genie', 'Attack: 12, Defense: 12', towns[2], 550, 3, callback);
    },
    function(callback) {
      unitCreate('Naga', 'Attack: 16, Defense: 13', towns[2], 1100, 2, callback);
    },
    function(callback) {
      unitCreate('Giant', 'Attack: 19, Defense: 16', towns[2], 2000, 1, callback);
    },
    function(callback) {
      unitCreate('Gnoll', 'Attack: 3, Defense: 5', towns[3], 50, 12, callback);
    },
    function(callback) {
      unitCreate('Lizardman', 'Attack: 5, Defense: 6', towns[3], 110, 9, callback);
    },
    function(callback) {
      unitCreate('Serpent Fly', 'Attack: 7, Defense: 9', towns[3], 220, 8, callback);
    },
    function(callback) {
      unitCreate('Basilisk', 'Attack: 11, Defense: 11', towns[3], 325, 4, callback);
    },
    function(callback) {
      unitCreate('Gorgon', 'Attack: 10, Defense: 14', towns[3], 525, 3, callback);
    },
    function(callback) {
      unitCreate('Wyvern', 'Attack: 14, Defense: 14', towns[3], 800, 2, callback);
    },
    function(callback) {
      unitCreate('Hydra', 'Attack: 16, Defense: 18', towns[3], 2200, 1, callback);
    },
    function(callback) {
      unitCreate('Goblin', 'Attack: 4, Defense: 2', towns[4], 40, 15, callback);
    },
    function(callback) {
      unitCreate('Wolf Rider', 'Attack: 7, Defense: 5', towns[4], 100, 9, callback);
    },
    function(callback) {
      unitCreate('Orc', 'Attack: 8, Defense: 4', towns[4], 150, 7, callback);
    },
    function(callback) {
      unitCreate('Ogre', 'Attack: 13, Defense: 7', towns[4], 300, 4, callback);
    },
    function(callback) {
      unitCreate('Roc', 'Attack: 13, Defense: 11', towns[4], 600, 3, callback);
    },
    function(callback) {
      unitCreate('Cyclops', 'Attack: 15, Defense: 12', towns[4], 750, 2, callback);
    },
    function(callback) {
      unitCreate('Behemoth', 'Attack: 17, Defense: 17', towns[4], 1500, 1, callback);
    },
    function(callback) {
      unitCreate('Pixie', 'Attack: 2, Defense: 2', towns[5], 25, 20, callback);
    },
    function(callback) {
      unitCreate('Air Elemental', 'Attack: 9, Defense: 9', towns[5], 250, 6, callback);
    },
    function(callback) {
      unitCreate('Water Elemental', 'Attack: 8, Defense: 10', towns[5], 300, 6, callback);
    },
    function(callback) {
      unitCreate('Fire Elemental', 'Attack: 10, Defense: 8', towns[5], 350, 5, callback);
    },
    function(callback) {
      unitCreate('Earth Elemental', 'Attack: 10, Defense: 10', towns[5], 400, 4, callback);
    },
    function(callback) {
      unitCreate('Psychic Elemental', 'Attack: 15, Defense: 13', towns[5], 750, 2, callback);
    },
    function(callback) {
      unitCreate('Firebird', 'Attack: 18, Defense: 18', towns[5], 1500, 2, callback);
    },
    function(callback) {
      unitCreate('Imp', 'Attack: 2, Defense: 3', towns[6], 50, 15, callback);
    },
    function(callback) {
      unitCreate('Gog', 'Attack: 6, Defense: 4', towns[6], 125, 8, callback);
    },
    function(callback) {
      unitCreate('Hell Hound', 'Attack: 10, Defense: 6', towns[6], 200, 5, callback);
    },
    function(callback) {
      unitCreate('Demon', 'Attack: 10, Defense: 10', towns[6], 250, 4, callback);
    },
    function(callback) {
      unitCreate('Pit Fiend', 'Attack: 13, Defense: 13', towns[6], 500, 3, callback);
    },
    function(callback) {
      unitCreate('Efreet', 'Attack: 16, Defense: 12', towns[6], 900, 2, callback);
    },
    function(callback) {
      unitCreate('Devil', 'Attack: 19, Defense: 21', towns[6], 2700, 1, callback);
    },
    function(callback) {
      unitCreate('Troglodyte', 'Attack: 4, Defense: 3', towns[7], 50, 14, callback);
    },
    function(callback) {
      unitCreate('Harpy', 'Attack: 6, Defense: 5', towns[7], 130, 8, callback);
    },
    function(callback) {
      unitCreate('Beholder', 'Attack: 9, Defense: 7', towns[7], 250, 7, callback);
    },
    function(callback) {
      unitCreate('Medusa', 'Attack: 9, Defense: 9', towns[7], 300, 4, callback);
    },
    function(callback) {
      unitCreate('Minotaur', 'Attack: 14, Defense: 12', towns[7], 500, 3, callback);
    },
    function(callback) {
      unitCreate('Manticore', 'Attack: 15, Defense: 13', towns[7], 850, 2, callback);
    },
    function(callback) {
      unitCreate('Red Dragon', 'Attack: 19, Defense: 19', towns[7], 2500, 1, callback);
    },
    function(callback) {
      unitCreate('Skeleton', 'Attack: 5, Defense: 4', towns[8], 60, 12, callback);
    },
    function(callback) {
      unitCreate('Walking Dead', 'Attack: 5, Defense: 5', towns[8], 100, 8, callback);
    },
    function(callback) {
      unitCreate('Wight', 'Attack: 7, Defense: 7', towns[8], 200, 7, callback);
    },
    function(callback) {
      unitCreate('Vampire', 'Attack: 10, Defense: 9', towns[8], 360, 4, callback);
    },
    function(callback) {
      unitCreate('Lich', 'Attack: 13, Defense: 10', towns[8], 550, 3, callback);
    },
    function(callback) {
      unitCreate('Black Knight', 'Attack: 16, Defense: 16', towns[8], 1200, 2, callback);
    },
    function(callback) {
      unitCreate('Bone Dragon', 'Attack: 17, Defense: 15', towns[8], 1800, 1, callback);
    }
  ],
  // optional callback
  cb)
}

async.series([
    createTowns,
    createUnits
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Units: '+units);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TownSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100},
        description: {type: String, required: true},
        alignment: {type: String, required: true, enum: ['Good', 'Neutral', 'Evil']}
    }
);

// Virtual for unit's URL
TownSchema
.virtual('url')
.get(function () {
    return '/inventory/town/' + this._id;
});

// Export module
module.exports = mongoose.model('Town', TownSchema);
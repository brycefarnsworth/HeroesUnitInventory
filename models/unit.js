var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UnitSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100},
        description: {type: String, required: true},
        town: {type: Schema.Types.ObjectId, ref: 'Town', required: true},
        price: {type: Number, required: true, min: 0},
        available: {type: Number, required: true, min: 0}
    }
);

// Virtual for unit's URL
UnitSchema
.virtual('url')
.get(function () {
    return '/inventory/unit/' + this._id;
});

// Export module
module.exports = mongoose.model('Unit', UnitSchema);
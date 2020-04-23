var mongoose = require('mongoose');

// schema
var styleSchema = mongoose.Schema({
    name:{type:String, required:[true,'Food Style name required']},
    description:{type:String},
    createdAt:{type:Date, default:Date.now},
});

// model & export
var Style = mongoose.model('style', styleSchema);
module.exports = Style;
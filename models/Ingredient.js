var mongoose = require('mongoose');

// schema
var ingredientsSchema = mongoose.Schema({
    name:{type:String, required:[true,'Ingredient name required']},
    createdAt:{type:Date, default:Date.now},
});

// model & export
var Ingredient = mongoose.model('ingredient', ingredientsSchema);
module.exports = Ingredient;
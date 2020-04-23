var mongoose = require('mongoose');

// schema
var consumedDateSchema = mongoose.Schema({
    post:{type:mongoose.Schema.Types.ObjectId, ref:'post', required:true},
    createdAt:{type:Date, default:Date.now},
});

// model & export
var ConsumedDate = mongoose.model('consumedDate', consumedDateSchema);
module.exports = ConsumedDate;
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Vote = new Schema({
    pollId: String,     // the poll where the vote belongs
    vote: Number,       // the index of the option the user chose
    voter: String       // the voter
});

module.exports = mongoose.model('Vote', Vote);

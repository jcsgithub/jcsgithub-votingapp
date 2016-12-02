'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Vote = new Schema({
    pollId: String,     // the poll where the vote belongs
    userId: String,     // the voter
    vote: Number        // the index of the option the user chose
});

module.exports = mongoose.model('Vote', Vote);

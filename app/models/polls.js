'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    description: String,    // title of the poll
    options: Array,         // available choices
    userId: String          // creator of the poll
});

module.exports = mongoose.model('Poll', Poll);

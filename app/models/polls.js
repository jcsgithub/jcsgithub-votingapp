'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    creator: String,                // creator of the poll
    description: String,            // title of the poll
    description_lower: String,      // lowercase description for search query
    options: Array                  // available choices
});

module.exports = mongoose.model('Poll', Poll);

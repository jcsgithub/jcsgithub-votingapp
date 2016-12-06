'use strict';

var Polls = require('../models/polls.js');

function PollHandler () {
    this.addPoll = function (req, res) {
        var data = req.body;
        
        // Checks if user already created the same poll
        Polls
            .findOne({ 'creator': data.creator, 'description_lower': data.description.toLowerCase() }, { '_id': false })
            .exec(function (err, result) {
                if (err) { throw err; }
                
                if (result) {
                    res.status(500).send('You already created a poll with the same description.');
                } else {
                    var poll = new Polls({
                        creator: data.creator,
                        description: data.description,
                        description_lower: data.description.toLowerCase(),
                        options: data.options
                    });
                    
                    console.log(data)
                    
                    poll.save(function (err) {
                        if (err) { return err; }
                        res.sendStatus(200);
                    });
                }
                
            });
    };
    
    this.deletePoll = function (req, res) {
        console.log('deletePoll', req);
        // Polls.remove({}, function(err) { 
        //   console.log('collection removed') 
        //   res.send({ data: docs });
        // });
    };
    
    this.getMyPolls = function (req, res) {
        var data = req.query;
        
        Polls
            .find({ 'creator': data.creator }, function (err, docs) {
                if (err) { throw err; }
                
                res.send({ data: docs });
            });
    };
    
    this.getPollById = function (req, res) {
        var data = req.params;
        
        Polls
            .findOne({ '_id': data.id }, function (err, result) {
                if (err) { throw err; }
                
                res.send(result);
            });
    };
    
    this.getPolls = function (req, res) {
        Polls
            .find({}, function (err, docs) {
                if (err) { throw err; }
                
                res.send({ data: docs });
            });
    };
    
    this.updatePoll = function (req, res) {
        var data = req.params;
        var newData = req.body;
        
        console.log('updatePoll', data, newData)
        
        Polls
            .findOneAndUpdate({ '_id': data.id }, { options: newData })
            .exec(function (err, result) {
                if (err) { throw err; }
        
                res.sendStatus(200);
            }
        );
    };
}

module.exports = PollHandler;
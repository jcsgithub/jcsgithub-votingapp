'use strict';

var Polls = require('../models/polls.js');

function PollHandler () {
    this.addPoll = function (req, res) {
        var data = req.body;
        
        // Checks if poll already exists
        Polls
            .findOne({ 'description_lower': data.description.toLowerCase() }, { '_id': false })
            .exec(function (err, result) {
                if (err) { throw err; }
                
                if (result) {
                    if (result.creator == data.creator)
                        res.status(500).send('You already created a poll with the same description.');
                    else
                        res.status(500).send('Someone already created a poll with the same description.');
                } else {
                    var poll = new Polls({
                        creator: data.creator,
                        description: data.description,
                        description_lower: data.description.toLowerCase(),
                        options: data.options
                    });
                    
                    poll.save(function (err) {
                        if (err) { return err; }
                        res.sendStatus(200);
                    });
                }
                
            });
    };
    
    this.isCreatorValid = function (req, res, next) {
        var creator = req.user.facebook.id;
        var pollId = req.params.id;
        
        // Checks if active user created the poll
        Polls
            .findOne({ '_id': pollId }, { '_id': false })
            .exec(function (err, result) {
                if (err) { 
                    res.status(404).send('Poll not found.');
                } else {
                    if (result) {
                        if (result.creator == creator)
                            return next();  
                        else
                            res.status(401).send('You are unauthorized to access this poll.');
                    } else {
                        res.status(404).send('Poll not found.');
                    }
                }
            });
    };
    
    this.deletePoll = function (req, res) {
        var pollId = req.params.id;
        
        Polls
            .findOne({ '_id': pollId })
            .remove()
            .exec(function (err, result) {
                if (err) { 
                    res.status(404).send('Poll not found.');
                } else {
                    if (result) {
                        res.sendStatus(200);
                    } else {
                        res.status(401).send('You are unauthorized to delete this poll.');
                    }
                }
            });
    };
    
    this.getMyPolls = function (req, res) {
        var data = req.query;
        
        Polls
            .find({ 'creator': data.creator }, null, {sort: {'_id': -1}}, function (err, docs) {
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
            .find({}, null, {sort: {'_id': -1}}, function (err, docs) {
                if (err) { throw err; }
                
                res.send({ data: docs });
            });
    };
    
    this.updatePoll = function (req, res) {
        var data = req.params;
        var newData = req.body;
        
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
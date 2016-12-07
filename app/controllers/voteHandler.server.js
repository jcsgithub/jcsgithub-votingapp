'use strict';

var Votes = require('../models/votes.js');

function VoteHandler () {
    this.deleteVotes = function (req, res) {
        var pollId = req.params.id;
        
        Votes
            .find({ 'pollId': pollId })
            .remove()
            .exec(function (err, results) {
                if (err) { 
                    res.status(404).send('Votes not found.');
                } else {
                    if (results) {
                        res.sendStatus(200);
                    } else {
                        res.status(401).send('You are unauthorized to delete these votes.');
                    }
                }
            });  
    };
    
    this.getVote = function (req, res) {
        var data = req.params;
        
        // Checks if user already voted for the same poll
        Votes
            .findOne({ 'pollId': data.pollId, 'voter': data.voter })
            .exec(function (err, result) {
                if (err) { throw err; }
                
                res.send({ data: result });
            });
    };
    
    this.submitVote = function (req, res) {
        var data = req.body;
        
        var vote = new Votes(data);
        
        vote.save(function (err) {
            if (err) { return err; }
            
            res.sendStatus(200);
        });
    };
}

module.exports = VoteHandler;
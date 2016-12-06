'use strict';

var Votes = require('../models/votes.js');

function VoteHandler () {
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
        
        console.log('submitVote', data)  
        
        var vote = new Votes(data);
        
        vote.save(function (err) {
            if (err) { return err; }
            
            res.sendStatus(200);
        });
    };
}

module.exports = VoteHandler;
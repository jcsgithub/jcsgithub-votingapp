'use strict';

var path = process.cwd();

module.exports = function (app, passport) {

    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    }

	function isAuthorized (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.sendStatus(401);
		}
	}





	/***** Public routes *****/
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/polls/:id')
		.get(function (req, res) {
			res.sendFile(path + '/public/public-poll.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/mypolls')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/mypolls.html');
		});

	app.route('/newpoll')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/newpoll.html');
		});

	app.route('/newpoll/success')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/newpoll-success.html');
		});

		
		
		

	/***** APIs *****/
	// Paths to import
	var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
	var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
	
	
	// Objects imported
	var pollHandler = new PollHandler();
	var voteHandler = new VoteHandler();
	
        
    // Polls
    app.route('/api/mypolls')
        .get(isLoggedIn, pollHandler.getMyPolls);
    app.route('/api/polls')
        .get(pollHandler.getPolls);
    app.route('/api/poll/:id')
        .get(pollHandler.getPollById)
        .put(pollHandler.updatePoll);
    app.route('/api/poll/new')
        .post(isLoggedIn, pollHandler.addPoll);
        
    // Votes
    app.route('/api/vote/:pollId/:voter')
    	.get(voteHandler.getVote)
        .post(voteHandler.submitVote);
	
	// User
    app.route('/api/user')
        .get(isAuthorized, function (req, res) {
            res.json(req.user.facebook);
        });
    
    
    


	/***** Facebook authorization *****/
	app.route('/auth/facebook')
		.get(passport.authenticate('facebook'));

	app.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', {
			successRedirect: 'back',
			failureRedirect: '/'
		}));
};

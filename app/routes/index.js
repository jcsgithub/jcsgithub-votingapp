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
	
	
	// Objects imported
	var pollHandler = new PollHandler();
	
        
    // Polls
    app.route('/api/polls')
        .get(pollHandler.getPolls);
    app.route('/api/poll/new')
        .post(isLoggedIn, pollHandler.addPoll);
    app.route('/api/mypolls')
        .get(isLoggedIn, pollHandler.getMyPolls);
	
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
			successRedirect: '/mypolls',
			failureRedirect: '/'
		}));
};

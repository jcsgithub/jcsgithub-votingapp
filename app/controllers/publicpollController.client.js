'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('publicpollController', ['$http', '$q', '$resource', '$scope', function ($http, $q, $resource, $scope) {
         
         /***** INITIALIZE *****/
         $scope.isUserLoggedIn = false;
         $scope.loader = { isLoadingData: true, isSubmitting: false, isSharing: false };
         $scope.poll = {};
         $scope.selectedOption = '';
         $scope.vote = {};
         $scope.vote.pollId = window.location.href.split('/').pop(); // Get the poll id from the url
         $scope.vote.pollId = $scope.vote.pollId.replace(/[^a-zA-Z0-9 ]/g, ""); // Remove special characters if any after logging in via facebook
         $scope.voteObject;
         
         var PollById = $resource(
            '/api/poll/' + $scope.vote.pollId,
            { id: '@id' }, 
            { update: { method: 'PUT' } }
         );
         var User = $resource('/api/user');
         var Vote;
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getUserVote (Vote) {
            Vote.get(function (res) {
               $scope.loader.isLoadingData = false;
               $('.viewpoll').removeClass('hidden');
               
               $scope.voteObject = res.data;
            }, function (err) {
               $scope.loader.isLoadingData = false;
               
               console.log('Vote.get error', err);
               alert('Oops! Something went wrong. Try again later.');
            });
         }
         
         // Wait for all queries to be done, then get user's vote data
         $q.all([
            
            // get poll data
            PollById.get().$promise.then(function (res) {
               $scope.poll = res;
            }, function (err) {
               console.log('getPollById error', err);
               alert('Oops! Something went wrong. Try again later.');
            }),
            
            // get user data
            User.get().$promise.then(function (res) {
               if (res.displayName !== null) {
                  $scope.isUserLoggedIn = true;
                  $scope.vote.voter = res.id;
                  
                  $("#authorized-navbar").removeClass("hide");
                  $("#unauthorized-navbar").addClass("hide");
               }
            }, function (err) {
               $("#authorized-navbar").addClass("hide");
               $("#unauthorized-navbar").removeClass("hide");
            })
            
         ]).then(function (success) {
            if ($scope.isUserLoggedIn) {
               Vote = $resource('/api/vote/' + $scope.vote.pollId + '/' + $scope.vote.voter);
               
               getUserVote(Vote);
            } else {
               $http.get('https://api.ipify.org').then(function (res) {
                  $scope.vote.voter = res.data;
                  Vote = $resource('/api/vote/' + $scope.vote.pollId + '/' + $scope.vote.voter);
                  
                  getUserVote(Vote);
               }, function (err) {
                  console.log('getting ip address error', err);
                  alert('Oops! Something went wrong. Try again later.');
               });
            }
         });

         
         
         /***** USER CONTROLS *****/
         $scope.sharePoll = function () {
            
         };
         
         $scope.submitVote = function () {
            var newOption = $('#newoption').val();
            var newOptionsValue = $scope.poll.options;
            
            if ($scope.selectedOption == 'other-select-option') {
               $scope.vote.vote = $scope.poll.options.length;
               
               // create a new option for the poll
               $scope.poll.options.push({ name: newOption, vote: 1 });
            } else {
               $scope.vote.vote = Number($scope.selectedOption);
               
               // add 1 to the current vote count of selected option
               $scope.poll.options[$scope.vote.vote].vote += 1;
            }
            
            if (!$scope.voteObject) {
               $scope.loader.isSubmitting = true;
               
               $q.all([
                  
                  // create new vote
                  Vote.save($scope.vote, function (res) {
                     console.log('Vote.save', res)
                  }, function (err) {
                     console.log('Vote.save error', err);
                  }),
                  
                  // update poll votes
                  PollById.update(newOptionsValue, $scope.poll.options, function (res) {
                     console.log('PollById.update', res)
                  }, function (err) {
                     console.log('PollById.update error', err);
                  })
                  
               ]).then(function (success) {
                  alert('Vote success!');
                  location.reload();
               });
               
            } else {
               if ($scope.isUserLoggedIn) 
                  alert('You already voted for this poll!');
               else 
                  alert('Your public IP address has voted for this poll!');
            }
         };
      }]);
})();
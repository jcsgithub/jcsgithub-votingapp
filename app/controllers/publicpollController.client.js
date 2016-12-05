'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('publicpollController', ['$scope', '$resource', '$q', function ($scope, $resource, $q) {
         
         /***** INITIALIZE *****/
         $scope.isUserLoggedIn = false;
         $scope.loader = { isLoadingPoll: true, isSubmitting: false, isSharing: false };
         $scope.poll = {};
         $scope.selectedOption = '';
         $scope.newVote = {};
         
         var pollId = window.location.href.split('/').pop(); // Get the poll id from the url
         pollId = pollId.replace(/[^a-zA-Z0-9 ]/g, ""); // Remove special characters if any after logging in via facebook
         
         var PollById = $resource('/api/poll/' + pollId);
         var User = $resource('/api/user');
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getUserVote () {
            
         }
         
         // Wait for all queries to be done, then get user's vote data
         $q.all([
            
            PollById.get().$promise.then(function (res) {
               $scope.loader.isLoadingPoll = false;
               $scope.poll = res;
            }, function (err) {
               $scope.loader.isLoadingPoll = false;
               
               console.log('getPollById error', err);
               alert('Oops! Something went wrong. Try again later.');
            }),
            
            User.get().$promise.then(function (res) {
               if (res.displayName !== null) {
                  $scope.isUserLoggedIn = true;
                  $scope.newVote.userId = res.id;
                  
                  $("#authorized-navbar").removeClass("hide");
                  $("#unauthorized-navbar").addClass("hide");
               }
            }, function (err) {
               $("#authorized-navbar").addClass("hide");
               $("#unauthorized-navbar").removeClass("hide");
            })
            
         ]).then(function (success) {
            var Vote;
            
            // if logged in, pass the userId and pollId
            if ($scope.isUserLoggedIn) {
               console.log('user is logged in')
               Vote = $resource('/api/vote/' + pollId + '/' + $scope.newVote.userId);
               
               Vote.get(function (res) {
                  console.log('Vote.get')
                  console.log(res)
               }, function (err) {
                  $scope.loader.isLoadingPoll = false;
                  
                  console.log('Vote.get error', err);
                  alert('Oops! Something went wrong. Try again later.');
               });
            } else {
               console.log('user is not logged in')
            }
         });

         
         
         /***** USER CONTROLS *****/
         $scope.sharePoll = function () {
            
         };
         
         $scope.submitVote = function () {
            
         };
      }]);
})();
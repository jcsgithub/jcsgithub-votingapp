'use strict';

window.fbAsyncInit = function() {
   FB.init({
      appId      : '1149618391821610',
      xfbml      : true,
      version    : 'v2.8'
   });
   FB.AppEvents.logPageView();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

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
         function createPieChart () {
            var ctx = $("#myChart");
            var backgroundColor = [];
            var datasetsData = [], labels = [];
            
            // populate chart data
            for (var i in $scope.poll.options) {
               datasetsData.push($scope.poll.options[i].vote);
               labels.push($scope.poll.options[i].name);
               
               backgroundColor.push(dynamicColors());
            }
            
            var data = {
                labels: labels,
                datasets: [
                    {
                        data: datasetsData,
                        backgroundColor: backgroundColor
                    }]
            };
            
            var options = {
                type:"pie",
                animation:{
                    animateScale:true
                }
            }
            
            var myPieChart = new Chart(ctx,{
                type: 'pie',
                data: data,
                options: options
            });
         }
         
         function dynamicColors () {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
         }
         
         function getUserVote (Vote) {
            Vote.get(function (res) {
               $scope.loader.isLoadingData = false;
               $('.viewpoll').removeClass('hidden');
               
               $scope.voteObject = res.data;
               
               createPieChart();
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
            FB.ui({
               method: 'feed',
               link: window.location.href,
               caption: 'TITLE: ' + $scope.poll.description,
               description: 'Click to cast your vote now!'
            }, function(response){});
         };
         
         $scope.submitVote = function () {
            var isOptionDuplicate = false;
            var newOption = $('#newoption').val();
            
            if (!newOption)
               submitVoteNext();
            
            for (var i in $scope.poll.options) {
               if ($scope.poll.options[i].name.toLowerCase() == newOption.toLowerCase()) {
                  isOptionDuplicate = true;
                  break;
               }
            }
            
            if (isOptionDuplicate)
               alert('This option already exists!');
            else
               submitVoteNext();
         };
         
         function submitVoteNext () {
            var newOption = $('#newoption').val();
            
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
                     console.log('Vote saved')
                  }, function (err) {
                     console.log('Vote.save error', err);
                  }),
                  
                  // update poll votes
                  PollById.update($scope.poll.options, function (res) {
                     console.log('Poll updated')
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
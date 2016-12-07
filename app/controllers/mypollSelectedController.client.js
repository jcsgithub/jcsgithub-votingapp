'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('mypollSelectedController', ['$q', '$resource', '$scope', function ($q, $resource, $scope) {
         
         /***** INITIALIZE *****/
         $scope.loader = { isLoadingData: true, isDeleting: false };
         $scope.poll = {};
         
         var pollId = window.location.href.split('/').pop().replace(/[^a-zA-Z0-9 ]/g, ""); 
         var PollById = $resource('/api/poll/' + pollId);
         var VotesByPollId = $resource('/api/votes/' + pollId);
         
         getPollById();
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getPollById () {
            PollById.get().$promise.then(function (res) {
               $scope.loader.isLoadingData = false;
               $scope.poll = res;
            }, function (err) {
               console.log('getPollById error', err);
               alert('Oops! Something went wrong. Try again later.');
            })
         }

         
         
         /***** USER CONTROLS *****/
         $scope.deletePoll = function () {
            $scope.loader.isDeleting = true;
            $('.deleting-spinner').removeClass('hidden');
            
            $q.all([
               
               // delete selected poll
               PollById.delete().$promise.then(function (res) {
                  console.log('Poll deleted')
               }, function (err) {
                  console.log('PollById.delete error', err);
               }),
               
               // delete all votes of the poll
               VotesByPollId.delete().$promise.then(function (res) {
                  console.log('Votes deleted')
               }, function (err) {
                  console.log('VotesByPollId.delete error', err);
               })
            
            ]).then(function (success) {
               $('#successModal').modal('show');
               $('#successModal').on('hide.bs.modal', function (e) {
                  window.location = 'https://jcsgithub-votingapp.herokuapp.com/mypolls';
               });
            });
         };
      }]);
})();
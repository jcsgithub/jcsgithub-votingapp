'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('newpollController', ['$scope', '$resource', function ($scope, $resource) {
         
         /***** INITIALIZE *****/
         $scope.loader = { isAddingPoll: false };
         $scope.newPoll = { creator: '', description: '', options: [] };
         $scope.newOption = '';
         
         var User = $resource('/api/user');
         var NewPoll = $resource('/api/poll/new');
         
         getUser();



         /***** CONTROLLER FUNCTIONS *****/
         function getUser () {
            User.get(function (result) {
               $scope.newPoll.creator = result.id;
            });
         }

         
         
         /***** USER CONTROLS *****/
         $scope.addOption = function (option) {
            if (!option) {
               alert('Option required!');
            } else {
               $scope.newPoll.options.push(option);
               $scope.newOption = '';
            }
         };
         
         $scope.deleteOption = function (index) {
            $scope.newPoll.options.splice(index, 1);
         };
         
         $scope.addPoll = function () {
            if ($scope.newPoll.options.length < 2) {
               alert('At least 2 options are required!');
            } else {
               $scope.loader.isAddingPoll = true;
               NewPoll.save($scope.newPoll, function (res) {
                  window.location = 'https://jcsgithub-votingapp-jcsgithub.c9users.io/newpoll/success';
               }, function (err) {
                  $scope.loader.isAddingPoll = false;
                  if (err.status == 500)
                     alert(err.data);
               });
            }
         };
      }]);
})();
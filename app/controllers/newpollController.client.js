'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('newpollController', ['$scope', '$resource', function ($scope, $resource) {
         
         /***** INITIALIZE *****/
         $scope.newPoll = { creator: '', description: '', options: [] };
         $scope.newOption = '';
         
         var User = $resource('/api/user');
         
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
         
         $scope.createPoll = function () {
             if ($scope.newPoll.options.length < 2) {
               alert('At least 2 options are required!');
             } else {
                console.log($scope.newPoll)
             }
         };
      }]);
})();
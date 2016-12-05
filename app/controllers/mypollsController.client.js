'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('mypollsController', ['$scope', '$resource', function ($scope, $resource) {
         
         /***** INITIALIZE *****/
         $scope.displayName = '';
         $scope.mypolls = [];
         
         var MyPolls = $resource('/api/mypolls');
         var User = $resource('/api/user');

         getUser();
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getMyPolls (id) {
            MyPolls.get({ creator: id }, function (res) {
               $scope.mypolls = res.data;
            }, function (err) {
               console.log('getMyPolls error', err);
               alert('Oops! Something went wrong. Try again later.');
            });
         }
         
         function getUser () {
            User.get(function (result) {
               $scope.displayName = result.displayName;
               $("#authorized-navbar").removeClass("hide");
               $("#unauthorized-navbar").addClass("hide");
               
               getMyPolls(result.id);
            });
         }
      }]);
})();
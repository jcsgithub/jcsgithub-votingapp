'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('newpollController', ['$scope', '$resource', function ($scope, $resource) {
         var User = $resource('/api/user');

         $scope.getUser = function () {
            User.get(function (result) {
               if (result.displayName !== null) {
                  $("#authorized-navbar").removeClass("hide");
                  $("#unauthorized-navbar").addClass("hide");
               }
            });
         };

         $scope.getUser();
      }]);
})();
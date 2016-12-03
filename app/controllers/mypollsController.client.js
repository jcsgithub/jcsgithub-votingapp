'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('mypollsController', ['$scope', '$resource', function ($scope, $resource) {
         var User = $resource('/api/user');

         $scope.getUser = function () {
            User.get(function (result) {
               $scope.displayName = result.displayName;
               $("#authorized-navbar").removeClass("hide");
               $("#unauthorized-navbar").addClass("hide");
            });
         };

         $scope.getUser();
      }]);
})();
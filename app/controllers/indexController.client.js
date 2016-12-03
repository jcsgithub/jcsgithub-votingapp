'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('indexController', ['$scope', '$resource', function ($scope, $resource) {
         var User = $resource('/api/user');

         $scope.getUser = function () {
            User.get(function (res) {
               if (res.displayName !== null) {
                  $("#authorized-navbar").removeClass("hide");
                  $("#unauthorized-navbar").addClass("hide");
               }
            }, function (err) {
               $("#authorized-navbar").addClass("hide");
               $("#unauthorized-navbar").removeClass("hide");
            });
         };

         $scope.getUser();
      }]);
})();
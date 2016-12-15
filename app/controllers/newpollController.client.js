'use strict';

(function () {
   angular
      .module('VotingApp', ['ngResource'])
      .controller('newpollController', ['$scope', '$resource', function ($scope, $resource) {
         
         /***** INITIALIZE *****/
         $scope.loader = { isAddingPoll: false };
         $scope.modal = { message: '' };
         $scope.newOption = '';
         $scope.newPoll = { creator: '', description: '', options: [] };
         
         var NewPoll = $resource('/api/poll/new');
         var User = $resource('/api/user');
         
         getUser();



         /***** CONTROLLER FUNCTIONS *****/
         function getUser () {
            User.get(function (result) {
               $scope.newPoll.creator = result.id;
            });
         }
         
         function showWarningModal (message) {
            $scope.modal.message = message;
            $('#warningModal').modal('show');
         }

         
         
         /***** USER CONTROLS *****/
         $scope.addOption = function (option) {
            if (!option) {
               showWarningModal('Option required!');
            } else {
               var isOptionDuplicate = false;
               
               for (var i in $scope.newPoll.options) {
                  if ($scope.newPoll.options[i].name.toLowerCase() == option.toLowerCase()) {
                     isOptionDuplicate = true;
                     break;
                  }
               }
               
               if (isOptionDuplicate) {
                  showWarningModal('This option already exists!');
               } else {
                  var optionObject = { name: option, vote: 0 };
                  
                  $scope.newPoll.options.push(optionObject);
                  $scope.newOption = '';
               }
            }
         };
         
         $scope.addPoll = function () {
            if ($scope.newPoll.options.length < 2) {
               showWarningModal('At least 2 options are required!');
            } else {
               $scope.loader.isAddingPoll = true;
               NewPoll.save($scope.newPoll, function (res) {
                  $('#successModal').modal('show');
                  $('#successModal').on('hide.bs.modal', function (e) {
                     window.location = 'https://jcsgithub-votingapp.herokuapp.com/mypolls';
                  });
               }, function (err) {
                  $scope.loader.isAddingPoll = false;
                  if (err.status == 500)
                     alert(err.data);
               });
            }
         };
         
         $scope.deleteOption = function (index) {
            $scope.newPoll.options.splice(index, 1);
         };
      }]);
})();
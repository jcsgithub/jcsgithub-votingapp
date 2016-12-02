'use strict';

(function () {
   var apiUrl = appUrl + '/api/user';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);
      
      if (userObject.displayName !== null) {
         $("#authorized-navbar").removeClass("hide");
         $("#unauthorized-navbar").addClass("hide");
      }
   }));
})();

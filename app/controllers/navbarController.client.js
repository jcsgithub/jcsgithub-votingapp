'use strict';

(function () {
   var displayName = document.querySelector('#display-name') || null;
   var apiUrl = appUrl + '/api/user';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);
      
      if (userObject.displayName !== null) {
         $("#authorized-navbar").removeClass("hide");
         $("#unauthorized-navbar").addClass("hide");
      }
   }));
})();

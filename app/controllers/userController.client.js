'use strict';

(function () {
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/user';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);
      
      updateHtmlElement(userObject, displayName, 'displayName');
      
      if (userObject.displayName !== null) {
         $("#authorized-navbar").removeClass("hide");
         $("#unauthorized-navbar").addClass("hide");
      }
   }));
})();

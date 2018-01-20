(function() {
    'use strict';
    
    var app = angular.module("app");

    app.controller("HomeController", function HomeController($state, FirebaseService) {
        var controller = this;
        
        controller.reports = [];
        
        (function main() {
            controller.reports = FirebaseService.getClients();
        })();
    });
})();
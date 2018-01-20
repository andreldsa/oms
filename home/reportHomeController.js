(function() {
    'use strict';
    
    var app = angular.module("app");

    app.controller("ReportHomeController", function ReportHomeController($state, $firebaseArray) {
        var controller = this;

        
        controller.reports = [];
        
        (function main() {
            var ref = firebase.database().ref();
            var reportsRef = ref.child("clients/");
            var firebaseArrayReport = $firebaseArray(reportsRef);
            firebaseArrayReport.$loaded().then(function (reports) {
                controller.reports = reports;
            });
        })();
    });
})();
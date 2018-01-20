(function() {
    'use strict';
    
    var app = angular.module("app");

    app.controller("ReportHomeController", function ReportHomeController($state, $firebaseArray) {
        var controller = this;

        var ref = firebase.database().ref();

        controller.reports = [];

        (function main() {
            var reportsRef = ref.child("reports/");
            var firebaseArrayReport = $firebaseArray(reportsRef);
            firebaseArrayReport.$loaded().then(function (reports) {
                controller.reports = reports;
            });
        })();
    });
})();
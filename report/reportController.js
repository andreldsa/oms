(function () {
    'use strict';

    var support = angular.module("support");

    support.controller("ReportController", function ReportController($state, MessageService, $firebaseArray) {
        var controller = this;

        controller.client = {};

        controller.clients = [
            {name: "André Abrantes", code: "46"}
        ]

        var firebaseRef = firebase.database().ref();

        controller.isValid = function isValid(formInvalid) {
            return controller.client.name && controller.client.code && !formInvalid;
        };

        controller.saveClient = function saveClient() {
            console.log(controller.client);

            var clientsRef = firebaseRef.child("clients/");
            var firebaseArray = $firebaseArray(clientsRef);
            firebaseArray.$loaded().then(function () {
                firebaseArray.$add(controller.client);
                controller.client = {};
            });

            MessageService.showToast("Cliente cadastrado com sucesso.");
            $state.go("support.home");
        };

        (function main() {
            var clientsRef = firebaseRef.child("clients/");
            var firebaseArray = $firebaseArray(clientsRef);
            firebaseArray.$loaded().then(function (clients) {
                controller.clients = clients;
            });
        })();
    });
})();
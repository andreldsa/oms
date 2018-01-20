(function () {
    'use strict';

    var support = angular.module("support");

    support.controller("ReportController", function ReportController($state, MessageService, $firebaseArray, $mdDialog) {
        var controller = this;

        controller.clients;
        controller.newClient;
        controller.selectedClient;

        var firebaseRef = firebase.database().ref();
        var clientsRef = firebaseRef.child("clients/");
        var firebaseArray = $firebaseArray(clientsRef);


        controller.isValid = function isValid(client, formInvalid) {
            return client && client.name && client.code && !formInvalid;
        };

        controller.createClient = function createClient() {
            firebaseArray.$add(controller.newClient).then(function() {
                controller.newClient = undefined;
                MessageService.showToast("Cliente cadastrado com sucesso.");
            });
        };

        function showDialog(dialogName, clickOutsideToClose) {
            $mdDialog.show({
                contentElement: '#' + dialogName,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: clickOutsideToClose
            });
        }

        controller.editClient = function editClient(client, event) {
            controller.selectedClient = client;
            showDialog('editClient', false);
        };

        controller.showClient = function showClient(client, event) {
            controller.selectedClient = client;
            showDialog('showClient', true);
        };

        controller.cancelEditClient = function cancelEditClient() {
            $mdDialog.cancel();
        };

        controller.updateClient = function updateClient() {
            firebaseArray.$save(controller.selectedClient);
            controller.selectedClient = undefined;
            $mdDialog.cancel();
            MessageService.showToast("Cliente atualizado com sucesso.");
        };

        (function main() {
            firebaseArray.$loaded().then(function (clients) {
                controller.clients = clients;
            });
        })();
    });
})();
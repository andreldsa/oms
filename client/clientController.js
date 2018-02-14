(function () {
    'use strict';

    var app = angular.module("app");

    app.controller("ClientController", function ClientController($state, MessageService, FirebaseService, $mdDialog) {
        var controller = this;

        controller.clients;
        controller.newClient;
        controller.selectedClient;

        controller.isValid = function isValid(client, formInvalid) {
            return client && client.name && client.code && !formInvalid;
        };

        controller.createClient = function createClient() {
            FirebaseService.addClient(controller.newClient).then(function() {
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

        controller.cancelDialog = function cancelDialog() {
            $mdDialog.cancel();
        };

        controller.updateClient = function updateClient() {
            FirebaseService.updateClient(controller.selectedClient).then(function() {
                controller.selectedClient = undefined;
                $mdDialog.cancel();
                MessageService.showToast("Cliente atualizado com sucesso.");
            });
        };
        
        controller.removeClient = function removeClient(client, event) {
            var confirm = $mdDialog.confirm()
                .title('Tem certeza que deseja remover?')
                .targetEvent(event)
                .ok('Sim')
                .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                var record = controller.clients.$indexFor(client.$id)
                controller.clients.$remove(record).then(function () {
                    MessageService.showToast("Cliente removido com sucesso.");
                });
            })
        };

        (function main() {
            controller.clients = FirebaseService.getClients();
        })();
    });
})();
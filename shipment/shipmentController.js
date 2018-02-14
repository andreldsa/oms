(function () {
    'use strict';

    var app = angular.module("app");

    app.controller("ShipmentController", function ShipmentController($state, MessageService, FirebaseService, $mdDialog) {
        var controller = this;

        controller.shipments;
        controller.newShipment;
        controller.selectedShipment;
        controller.requestsOfShipment;

        controller.clients = FirebaseService.getClients();

        controller.isValid = function isValid(shipment, formInvalid) {
            return shipment && shipment.refDate && !formInvalid;
        };

        controller.createShipment = function createShipment() {
            controller.newShipment.refDate = controller.newShipment.refDate.toISOString();
            FirebaseService.addShipment(controller.newShipment).then(function () {
                controller.newShipment = undefined;
                MessageService.showToast("Carga cadastrada com sucesso.");
            }, function (error) {
                console.log(error);
            });
        };

        function showDialog(dialogName, clickOutsideToClose, event) {
            $mdDialog.show({
                contentElement: '#' + dialogName,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: clickOutsideToClose,
                multiple: true
            });
        }

        controller.getClient = function getClient(clientId) {
            return controller.clients.$getRecord(clientId);
        };

        controller.cancelDialog = function cancelDialog() {
            $mdDialog.cancel();
        };

        controller.editShipment = function editShipment(shipment, event) {
            controller.selectedShipment = shipment;
            showDialog('editShipment', false, event);
        };

        controller.showShipment = function showShipment(shipment, event) {
            controller.selectedShipment = shipment;
            controller.requestsOfShipment = FirebaseService.getRequests(shipment.$id);
            showDialog('showShipment', true, event);
        };

        controller.updateShipment = function updateShipment() {
            var date = controller.selectedShipment.refDate;
            if (date instanceof Date) {
                controller.selectedShipment.refDate = date.toISOString();
            }
            FirebaseService.updateShipment(controller.selectedShipment).then(function () {
                controller.selectedShipment = undefined;
                $mdDialog.cancel();
                MessageService.showToast("Carga atualizada com sucesso.");
            });
        };

        controller.getWeight = function getWeight(shipment) {
            var shipmentWeight = 0;
            Object.values(shipment.requests).forEach(request => {
                var requestWeight = 0;
                request.itens.forEach(item => {
                    if (item.unit === "kg") {
                        requestWeight += item.quantity;
                    }
                });
                shipmentWeight += requestWeight;
            });
            return shipmentWeight;
        };

        controller.removeRequest = function removeRequest(request, event) {
            var confirm = $mdDialog.confirm()
                .title('Tem certeza que deseja remover?')
                .targetEvent(event)
                .ok('Sim')
                .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                var record = controller.requestsOfShipment.$indexFor(request.$id)
                controller.requestsOfShipment.$remove(record).then(function () {
                    MessageService.showToast("Pedido removido com sucesso.");
                });
            })
        };

        controller.print = function print() {
            $state.go("app.print", {id: controller.selectedShipment.$id});
        };

        (function main() {
            controller.shipments = FirebaseService.getShipments();
        })();
    });
})();
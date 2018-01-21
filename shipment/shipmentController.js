(function () {
    'use strict';

    var app = angular.module("app");

    app.controller("ShipmentController", function ShipmentController($state, MessageService, FirebaseService, $mdDialog) {
        var controller = this;

        controller.shipments;
        controller.newShipment;
        controller.selectedShipment;

        controller.isValid = function isValid(shipment, formInvalid) {
            return shipment && shipment.refDate && !formInvalid;
        };

        controller.createShipment = function createShipment() {
            controller.newShipment.refDate = controller.newShipment.refDate.toISOString();
            FirebaseService.addShipment(controller.newShipment).then(function() {
                controller.newShipment = undefined;
                MessageService.showToast("Carga cadastrada com sucesso.");
            }, function(error) {
                console.log(error);
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

        controller.cancelDialog = function cancelDialog() {
            $mdDialog.cancel();
        };

        controller.editShipment = function editShipment(shipment, event) {
            controller.selectedShipment = shipment;
            showDialog('editShipment', false);
        };

        controller.showShipment = function showShipment(shipment, event) {
            controller.selectedShipment = shipment;
            showDialog('showShipment', true);
        };

        controller.updateShipment = function updateShipment() {
            var date = controller.selectedShipment.refDate;
            if (date instanceof Date) {
                controller.selectedShipment.refDate = date.toISOString();
            }
            FirebaseService.updateShipment(controller.selectedShipment).then(function() {
                controller.selectedShipment = undefined;
                $mdDialog.cancel();
                MessageService.showToast("Carga atualizada com sucesso.");
            });
        };

        (function main() {
            controller.shipments = FirebaseService.getShipments();
        })();
    });
})();
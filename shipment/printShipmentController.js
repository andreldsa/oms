(function () {
    'use strict';

    var app = angular.module("app");

    app.controller("PrintShipmentController", function PrintShipmentController(FirebaseService, $stateParams) {
        var controller = this;

        let shipmentId = $stateParams.id;

        controller.shipment;
        controller.requestsOfShipment;

        controller.clients = FirebaseService.getClients();
        controller.shipments = FirebaseService.getShipments();
        controller.shipments.$loaded().then(function() {
            controller.shipment = controller.shipments.$getRecord(shipmentId);
            controller.requestsOfShipment = FirebaseService.getRequests(controller.shipment.$id);
        });

        controller.getClient = function getClient(clientId) {
            return controller.clients.$getRecord(clientId);
        };

        controller.getWeight = function getWeight() {
            var shipmentWeight = 0;
            Object.values(controller.shipment.requests).forEach(request => {
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
        
        controller.print = function() {
            window.print();
        };
    });
})();
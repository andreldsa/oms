(function () {
    'use strict';

    var app = angular.module("app");

    app.service("FirebaseService", function FirebaseService($q, $firebaseArray, MessageService) {
        var service = this;

        var firebaseRef = firebase.database().ref();

        var clientsRef = firebaseRef.child("clients/");
        var clientsArray = $firebaseArray(clientsRef);

        var productsRef = firebaseRef.child("products/");
        var productsArray = $firebaseArray(productsRef);
        
        var shipmentsRef = firebaseRef.child("shipments/");
        var shipmentsArray = $firebaseArray(shipmentsRef);

        service.addClient = function addClient(client) {
            return clientsArray.$add(client);
        };

        service.updateClient = function updateClient(client) {
            return clientsArray.$save(client);
        };

        service.getClients = function getClients() {
            return clientsArray;
        };

        service.addProduct = function addProduct(product) {
            return productsArray.$add(product);
        };

        service.updateProduct = function updateProduct(product) {
            return productsArray.$save(product);
        };

        service.getProducts = function getProducts() {
            return productsArray;
        };

        service.addShipment = function addShipment(shipment) {
            return shipmentsArray.$add(shipment);
        };

        service.updateShipment = function updateShipment(shipment) {
            return shipmentsArray.$save(shipment);
        };

        service.getShipments = function getShipments() {
            return shipmentsArray;
        };
    });
})();
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

        service.addClient = function addClient(client) {
            return clientsArray.$add(client);
        };

        service.updateClient = function updateClient(client) {
            return clientsArray.$save(client);
        };

        service.getClients = function getClients() {
            return clientsArray;
        };

        service.addProduct = function addProduct(client) {
            return productsArray.$add(client);
        };

        service.updateProduct = function updateProduct(client) {
            return productsArray.$save(client);
        };

        service.getProducts = function getProducts() {
            return productsArray;
        };
    });
})();
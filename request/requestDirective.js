(function() {
    var app = angular.module("app");

    app.controller('RequestController', function RequestController(FirebaseService) {
        var controller = this;

        controller.clients = FirebaseService.getClients();
        controller.shipments = FirebaseService.getShipments();
        controller.products = FirebaseService.getProducts();

        controller.newRequest = {
            itens: []
        };

        controller.selectedClient;

        controller.querySearch = function querySearch(query, list) {
            var results = query ? controller.clients.filter(createFilterFor(query)) : list,
                deferred;
            return list.filter(createFilterFor(query));
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(client) {
                var name = angular.lowercase(client.name);
                return (name.indexOf(lowercaseQuery) === 0);
            };
        }

        controller.addItem = function(product) {
            product.quantity = 1;
            controller.newRequest.itens.push(product);
        }
    });

    app.directive('request', function() {
        return {
            templateUrl: '/app/request/request.html',
            controller: 'RequestController',
            controllerAs: 'requestCtrl'
        }
    });
})();
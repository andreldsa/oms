(function() {
    var app = angular.module("app");

    app.controller('RequestController', function RequestController(FirebaseService) {
        var controller = this;

        controller.clients = FirebaseService.getClients();
        controller.shipments = FirebaseService.getShipments();

        controller.selectedClient;

        controller.querySearch = function querySearch(query) {
            var results = query ? controller.clients.filter(createFilterFor(query)) : controller.clients,
                deferred;
            return controller.clients.filter(createFilterFor(query));
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(client) {
                var name = angular.lowercase(client.name);
                return (name.indexOf(lowercaseQuery) === 0);
            };
        }
        console.log("controller")
    });

    app.directive('request', function() {
        console.log("ok")
        return {
            templateUrl: '/app/request/request.html',
            controller: 'RequestController',
            controllerAs: 'controller'
        }
    });
})();
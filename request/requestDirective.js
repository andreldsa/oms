(function () {
    var app = angular.module("app");

    app.controller('RequestController',
        function RequestController(FirebaseService, MessageService, $mdDialog) {
            var controller = this;

            controller.clients = FirebaseService.getClients();
            controller.shipments = FirebaseService.getShipments();
            controller.products = FirebaseService.getProducts();

            controller.newRequest = {
                itens: []
            };

            controller.selectedClient;
            controller.selectedShipment;

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

            controller.removeItem = function(index) {
                controller.newRequest.itens.splice(index, 1);
            };

            controller.addItem = function (product) {
                product.quantity = 1;
                var item = controller.newRequest.itens.find(function(obj) {
                    return obj.$id === product.$id;
                });
                if (!item) {
                    controller.newRequest.itens.push(product);
                } else {
                    MessageService.showToast("Produto já existe no pedido.");
                }
            };

            controller.isValid = function isValid() {
                return controller.selectedClient &&
                    controller.selectedShipment &&
                    controller.newRequest.itens.length > 0;
            };

            controller.save = function save() {
                controller.newRequest.clientId = controller.selectedClient.$id;
                FirebaseService.addRequest(controller.selectedShipment.$id, controller.newRequest).then(function (requestRef) {
                    var client = controller.clients.$getRecord(controller.selectedClient.$id);
                    if (client.requests) {
                        client.requests.push(requestRef.key);
                    } else {
                        client.requests = [requestRef.key];
                    }
                    controller.clients.$save(client);
                    MessageService.showToast("Pedido cadastrado com sucesso.");
                    $mdDialog.cancel();
                    controller.newRequest = undefined;
                    controller.selectedClient = null;
                    controller.selectedShipment = null;
                });
            };
        });

    app.directive('request', function () {
        return {
            templateUrl: '/app/request/request.html',
            controller: 'RequestController',
            controllerAs: 'requestCtrl'
        }
    });
})();
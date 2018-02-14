(function () {
    'use strict';

    var app = angular.module("app");

    app.controller("ProductController", function ProductController($state, MessageService, FirebaseService, $mdDialog) {
        var controller = this;

        controller.products;
        controller.newProduct;
        controller.selectedProduct;

        controller.isValid = function isValid(product, formInvalid) {
            return product && product.name && product.code && !formInvalid;
        };

        controller.createProduct = function createProduct() {
            FirebaseService.addProduct(controller.newProduct).then(function() {
                controller.newProduct = undefined;
                MessageService.showToast("Produto cadastrado com sucesso.");
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

        controller.editProduct = function editProduct(product, event) {
            controller.selectedProduct = product;
            showDialog('editProduct', false);
        };

        controller.showProduct = function showProduct(product, event) {
            controller.selectedProduct = product;
            showDialog('showProduct', true);
        };

        controller.cancelDialog = function cancelDialog() {
            $mdDialog.cancel();
        };

        controller.updateProduct = function updateProduct() {
            FirebaseService.updateProduct(controller.selectedProduct).then(function() {
                controller.selectedProduct = undefined;
                $mdDialog.cancel();
                MessageService.showToast("Produto atualizado com sucesso.");
            });
        };
        
        controller.removeProduct = function removeProduct(product, event) {
            var confirm = $mdDialog.confirm()
                .title('Tem certeza que deseja remover?')
                .targetEvent(event)
                .ok('Sim')
                .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                var record = controller.products.$indexFor(product.$id)
                controller.products.$remove(record).then(function () {
                    MessageService.showToast("Produto removido com sucesso.");
                });
            })
        };

        (function main() {
            controller.products = FirebaseService.getProducts();
        })();
    });
})();
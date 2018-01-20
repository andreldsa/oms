(function() {
    'use strict';
    
    var app = angular.module("app");

    app.controller("ErrorController", function ErrorController($state, $stateParams) {
        var errorCtrl = this;

        errorCtrl.msg = $stateParams.msg;
        errorCtrl.status = $stateParams.status;

        errorCtrl.goToHome = function goToHome() {
            $state.go("app.home");
        };
    });
})();
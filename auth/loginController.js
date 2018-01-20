(function() {
    'use strict';

    var support = angular.module("support");

    support.controller("LoginController", function LoginController(AuthService, MessageService, $state, $mdDialog, 
            $stateParams, $location, $window) {
        var loginCtrl = this;
            
        loginCtrl.user = {};

        loginCtrl.isRequestInvite = false;

        var redirectPath = $stateParams.redirect;

        loginCtrl.login = function login() {
            var promise = AuthService.login();
            promise.then(function success() {
                redirectTo(redirectPath);
            });
            return promise;
        };

        loginCtrl.limpar = function limpar() {
            loginCtrl.user = {};
        };

        loginCtrl.loginWithEmailPassword = function loginWithEmailPassword() {
            AuthService.loginWithEmailAndPassword(loginCtrl.user.email, loginCtrl.user.password).then(
                function success() {
                    redirectTo(redirectPath);
                }
            );
        };

        loginCtrl.redirect = function success() {
            redirectTo(redirectPath);
        };

        loginCtrl.resetPassword = function resetPassword(ev) {
            var confirm = $mdDialog.prompt()
                .title('Esqueceu sua senha?')
                .textContent('Digite seu email e enviaremos um link para criar uma nova senha.')
                .placeholder('Digite seu email')
                .ariaLabel('Digite seu emai')
                .targetEvent(ev)
                .required(true)
                .ok("Redefinir Senha")
                .cancel("Cancelar");

            $mdDialog.show(confirm).then(function(email) {
                AuthService.resetPassword(email);
            });
        };

        loginCtrl.goToLandingPage = function goToLandingPage() {
            $window.open(Config.LANDINGPAGE_URL, '_self');
        };

        loginCtrl.requestInvite = function requestInvite() {
            loginCtrl.isRequestInvite = !loginCtrl.isRequestInvite;
        };

        function redirectTo(path) {
            if (path) {
                $location.path(path);
            } else {
                $state.go("support.home");
            }
        }

        (function main() {
            if (AuthService.isLoggedIn()) {
                $state.go("support.home");
            }
        })();
    });
})();
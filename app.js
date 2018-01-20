(function() {
    'use strict';

    var app = angular.module('app', [
        'ngMaterial',
        'ui.router',
        'ngAnimate',
        'firebase',
        'ngSanitize',
        'angularMoment',
        'ngMessages',
        'ngMask'
    ]);

    app.config(function($mdIconProvider, $mdThemingProvider, $stateProvider, $urlMatcherFactoryProvider,
        $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider) {

        $mdIconProvider.fontSet('md', 'material-icons');
        $mdThemingProvider.theme('docs-dark');
        $mdThemingProvider.theme('input')
            .primaryPalette('green');
        $mdThemingProvider.theme('dialogTheme')
            .primaryPalette('teal');

        $urlMatcherFactoryProvider.caseInsensitive(true);

        $stateProvider
            .state("app", {
                abstract: true,
                views: {
                    main: {
                        templateUrl: "app/main/main.html",
                        controller: "MainController as controller"
                    }
                }
            })
            .state("app.home", {
                url: "/",
                views: {
                    content: {
                        templateUrl: "app/home/home.html",
                        controller: "HomeController as controller"
                    }
                }
            })
            .state("app.client", {
                url: "/client",
                views: {
                    content: {
                        templateUrl: "app/client/client.html",
                        controller: "ClientController as controller"
                    }
                }
            })
            .state("app.shipment", {
                url: "/shipment",
                views: {
                    content: {
                        templateUrl: "app/shipment/shipment.html",
                        controller: "ShipmentController as controller"
                    }
                }
            })
            .state("app.product", {
                url: "/product",
                views: {
                    content: {
                        templateUrl: "app/product/product.html",
                        controller: "ProductController as controller"
                    }
                }
            })
            .state("signin", {
                url: "/signin",
                views: {
                    main: {
                        templateUrl: "app/auth/login.html",
                        controller: "LoginController as loginCtrl"
                    }
                },
                params: {
                    "redirect": undefined
                }
            })
            .state("error", {
                url: "/error",
                views: {
                    main: {
                        templateUrl: "app/error/error.html",
                        controller: "ErrorController as errorCtrl"
                    }
                },
                params: {
                    "msg": "Desculpa! Ocorreu um erro.",
                    "status": "500"
                }
            });

        $urlRouterProvider.otherwise("/");

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('BearerAuthInterceptor');

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://www.gravatar.com/**',

            'https://www.youtube.com/**'
        ]);

        const dateFormats = {
            calendar: {
                sameDay: '[Hoje às] LT',
                lastWeek: 'DD MMMM [de] YYYY [às] LT',
                sameElse: 'DD MMMM [de] YYYY [às] LT'
            }
        };

        moment.updateLocale('pt-br', dateFormats);
    });

    app.factory('BearerAuthInterceptor', function ($injector, $q, $state) {
        return {
            request: function(config) {
                // var AuthService = $injector.get('AuthService');
                // config.headers = config.headers || {};
                // if (AuthService.isLoggedIn()) {
                //     var token = AuthService.getUserToken();
                //     config.headers.Authorization = 'Bearer ' + token;
                // }

                // Utils.updateBackendUrl(config);

                return $q.when(config);
            },
            responseError: function(rejection) {
                var AuthService = $injector.get('AuthService');
                if (rejection.status === 401) {
                    if (AuthService.isLoggedIn()) {
                        AuthService.logout();
                        rejection.data.msg = "Sua sessão expirou!";
                    } else {
                        $state.go("signin");
                    }
                } else if(rejection.status === 403) {
                    rejection.data.msg = "Você não tem permissão para realizar esta operação!";
                } else {
                    $state.go("error", {
                        "msg": rejection.data.msg || "Desculpa! Ocorreu um erro.",
                        "status": rejection.status
                    });
                }
                return $q.reject(rejection);
            }
        };
    });

    app.run(function authInterceptor(AuthService, $transitions, $injector, $state, $location) {
        var ignored_routes = [
            'signin'
        ];

        $transitions.onStart({
            to: function(state) {
                return !(_.includes(ignored_routes, state.name)) && !AuthService.isLoggedIn();
            }
        }, function(transition) {
            $state.go("signin", {
                "redirect": $location.path()
            });
        });
    });
})();
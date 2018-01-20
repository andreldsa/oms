(function() {
    'use strict';

    var support = angular.module("support");

    support.service("AuthService", function AuthService($q, $state, $firebaseAuth, $window, UserService, MessageService) {
        var service = this;

        var authObj = $firebaseAuth();

        var userInfo;

        /**
         * Store the last promise to refresh user authentication token.
         */
        var refreshTokenPromise = null;

        /**
        * Store listeners to be executed when user logout is called.
        */
        var onLogoutListeners = [];

        Object.defineProperty(service, 'user', {
            get: function() {
                return userInfo;
            }
        });

        service.login = function login() {
            var deferred = $q.defer();
            authObj.$signInWithPopup("google").then(function(result) {
                configUser(result.user);
                deferred.resolve(userInfo);
            }).catch(function(error) {
                MessageService.showToast(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.loginWithEmailAndPassword = function loginWithEmailAndPassword(email, password) {
            var deferred = $q.defer();
            authObj.$signInWithEmailAndPassword(email, password).then(function(user) {
                if (user.emailVerified) {
                    user.getIdToken(true).then(function(idToken) {
                        service.setupUser(idToken, user.emailVerified).then(function success(userInfo) {
                            deferred.resolve(userInfo);
                        });
                    });
                } else {
                    service.sendEmailVerification(user);
                    MessageService.showToast("Seu email precisa ser verificado.");
                    deferred.reject("Email not verified.");
                }
            }).catch(function(error) {
                MessageService.showToast(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.signupWithEmailAndPassword = function signupWithEmailAndPassword(email, password) {
            var deferred = $q.defer();
            authObj.$createUserWithEmailAndPassword(email, password).then(function(user) {
                service.sendEmailVerification();
                var idToken = user.toJSON().stsTokenManager.accessToken;
                service.setupUser(idToken, user.emailVerified).then(function success(userInfo) {
                    service.sendEmailVerification();
                    deferred.resolve(userInfo);
                });
            }).catch(function(error) {
                MessageService.showToast(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.logout = function logout() {
            authObj.$signOut();
            delete $window.localStorage.userInfo;
            userInfo = undefined;

            executeLogoutListeners();

            $state.go("signin");
        };

        service.getCurrentUser = function getCurrentUser() {
            return userInfo;
        };
        
        service.getUserToken = function getUserToken() {
            refreshTokenAsync();
            return userInfo.accessToken;
        };

        service.isLoggedIn = function isLoggedIn() {
            if (userInfo) {
                return true;
            }
            return false;
        };

        service.save = function() {
            $window.localStorage.userInfo = JSON.stringify(userInfo);
        };

        service.reload = function reload() {
            var deferred = $q.defer();
            UserService.load().then(function success(userLoaded) {
                var firebaseUser = {
                    accessToken: userInfo.accessToken,
                    emailVerified: userInfo.emailVerified
                };
                configUser(userLoaded, firebaseUser);
                deferred.resolve(userInfo);
            }, function error(error) {
                MessageService.showToast(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.sendEmailVerification = function sendEmailVerification(user) {
            var auth_user = user || authObj.$getAuth();
            auth_user.sendEmailVerification().then(
            function success() {
                MessageService.showToast('Email de verificação enviado para o seu email.');
            }, function error(error) {
                console.error(error);
            });
        };

        service.resetPassword = function resetPassword(email) {
            authObj.$sendPasswordResetEmail(email).then(
            function success() {
                MessageService.showToast('Você receberá um email para resetar sua senha.');
            }, function error(error) {
                console.error(error);
            });
        };

        service.$onLogout = function $onLogout(callback) {
            onLogoutListeners.push(callback);
        };

        service.emailVerified = function emailVerified() {
            if (userInfo) return userInfo.emailVerified;
            return false;
        };

        /**
        * Execute each function stored to be thriggered when user logout
        * is called.
        */
        function executeLogoutListeners() {
            _.each(onLogoutListeners, function(callback) {
                callback();
            });
        }

        function configUser(firebaseUser) {
            userInfo = new User(firebaseUser);
            $window.localStorage.userInfo = JSON.stringify(userInfo);
        }

        function init() {
            if ($window.localStorage.userInfo) {
                var parse = JSON.parse($window.localStorage.userInfo);
                userInfo = new User(parse);
            }
        }

        /**
         * Refreshes the user token asynchronously and store in the browser
         * cache to maintain the section active, during the time that 
         * the user is using the system. 
         * 
         * This function uses a global variable (refreshTokenPromise)
         * to synchronize the token API call's, preventing multiples
         * promises executing the same action.
         */
        function refreshTokenAsync() {
            var auth = authObj.$getAuth();
            if (auth && !refreshTokenPromise) {
                refreshTokenPromise = auth.getIdToken();
                refreshTokenPromise.then(function(idToken) {
                    userInfo.accessToken = idToken;
                    service.save();
                    refreshTokenPromise = null;
                });
            }
        }

        init();
    });
})();
(function() {
    'use strict';

    var support = angular.module("support");

    support.service("UserService", function UserService($http, $q) {
        var service = this;

        var USER_URI = "/api/user";

        service.deleteInstitution = function deleteInstitution(institutionKey) {
            var deffered = $q.defer();
            $http.delete(USER_URI + '/institutions/' + institutionKey).then(function success(info) {
                deffered.resolve(info.data);
            }, function error(data) {
                deffered.reject(data);
            });
            return deffered.promise;
        };

        service.save = function save(patch) {
            patch = JSON.parse(angular.toJson(patch));
            var deffered = $q.defer();
            $http.patch(USER_URI, patch).then(function success(info) {
                deffered.resolve(info.data);
            }, function error(data) {
                deffered.reject(data);
            });
            return deffered.promise;
        };

        service.getUser = function getUser(userKey) {
            var deffered = $q.defer();
            $http.get(USER_URI + "/" + userKey + "/profile").then(function loadUser(info) {
                deffered.resolve(info.data);
            }, function error(data) {
                deffered.reject(data);
            });
            return deffered.promise;
        };

        service.load = function load() {
            var deffered = $q.defer();
            $http.get(USER_URI).then(function loadUser(info) {
                deffered.resolve(info.data);
            }, function error(data) {
                deffered.reject(data);
            });
            return deffered.promise;
        };
    });
})();
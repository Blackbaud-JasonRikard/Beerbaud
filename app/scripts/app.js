'use strict';

/**
 * @ngdoc overview
 * @name beerbaudApp
 * @description
 * # beerbaudApp
 *
 * Main module of the application.
 */
angular
    .module('beerbaudApp', [
        'ngRoute',
        'sky'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).config(['$httpProvider', function($httpProvider) {
        // enable http caching since we're limited to 400 requests per day on the breweryDB
        $httpProvider.defaults.cache = true;
    }]);

'use strict';

/**
 * @ngdoc service
 * @name beerbaudApp.breweryDB
 * @description
 * # breweryDB
 * Factory in the beerbaudApp.
 * Wraps http://www.brewerydb.com/developers/docs
 */
angular.module('beerbaudApp')
    .factory('breweryDB', function($http, $q) {


        //This key intended to be private so it should be wrapped in a backend service instead.
        var apiKey = '7eb636262e2303386c98af7059c7b38d';

        //Blackbaud Proxy for CORs. We must http encode the params. We lose some flexibility by needing the proxy
        var proxy = 'https://api.blackbaud.com/services/proxy/';
        var urlBase = 'http://api.brewerydb.com/v2/';

        // Public API here
        return {
            getLocations: function(region, pageNum) {
                return $http.get(proxy, {
                        params: {
                          url: urlBase + 'locations?key='+ apiKey + '&region=' + encodeURIComponent(region) + '&order=breweryName&p=' + pageNum,
                          mode: 'native'
                        }
                    }).then(function(result) {
                        var data = result.data;

                        if (data === 'something ') {
                            return $q.reject('Invalid data');
                        }

                        // var processedData = processData(data);
                        return data;
                    })
                    .catch(function(err) {
                        // for example, "re-throw" to "hide" HTTP specifics
                        return $q.reject('Data not available' + err);
                    });
            }
        };
    });

'use strict';

/**
 * @ngdoc function
 * @name beerbaudApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beerbaudApp
 */
angular.module('beerbaudApp')
    .controller('MainCtrl', function($scope, breweryDB) {

        $scope.locations = [];
        $scope.paginationOptions = { itemsPerPage: 20 };

        $scope.gridOptions = {
            columns: [{
                caption: 'Name',
                jsonmap: 'brewery.name',
                id: 1,
                name: 'name'
            }, {
                caption: 'Address',
                jsonmap: 'streetAddress',
                id: 2,
                name: 'address'
            }, {
                caption: 'Website',
                jsonmap: 'website',
                id: 3,
                name: 'website'
            }, {
                caption: 'Icon',
                jsonmap: 'brewery.images.icon',
                id: 4,
                name: 'icon'
            }],
            data: $scope.locations,
            fixedToolbar: true,
            selectedColumnIds: [1, 2, 3, 4],
            sortOptions: {
                excludedColumns: [
                    'address',
                    'website',
                    'icon'
                ]
            },
            hasInlineFilters: true,
            filters: {},
            loading: true
        };

        $scope.$on('loadMoreRows', function(event, data) {
            $scope.gridOptions.data = getPaginationDataSet(data.top, data.skip);
        });

        function getPaginationDataSet(top, skip) {
            return $scope.locations.slice(skip, (top + skip));
        }

        breweryDB.getLocations('North Carolina').then(function(locations) {
            $scope.locations = locations.data;
            $scope.gridOptions.loading = false;
            $scope.gridOptions.data = $scope.locations.slice(0, $scope.paginationOptions.itemsPerPage);

            $scope.$broadcast('reInitGrid');
            $scope.paginationOptions.recordCount = locations.totalResults;

        });

        //column sorting logic
        $scope.$watch(function() {
            return $scope.gridOptions.sortOptions;
        }, function() {
            $scope.gridOptions.data.sort(function(a, b) {
                var descending = $scope.gridOptions.sortOptions.descending ? -1 : 1,
                    sortProperty = $scope.gridOptions.sortOptions.column;
                if (a[sortProperty] > b[sortProperty]) {
                    return (descending);
                } else if (a[sortProperty] < b[sortProperty]) {
                    return (-1 * descending);
                } else {
                    return 0;
                }
            });
        }, true);


    });

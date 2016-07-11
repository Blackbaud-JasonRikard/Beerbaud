'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
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
                caption: 'Street Address',
                jsonmap: 'streetAddress',
                id: 2,
                name: 'streetAddress'
            },{
                caption: 'City',
                jsonmap: 'locality',
                id: 3,
                name: 'locality'
            }, {
                caption: 'Website',
                jsonmap: 'brewery',
                id: 4,
                name: 'website',
                template_url: 'views/grid/website_column.html'
            }, {
                caption: 'Icon',
                jsonmap: 'brewery.images',
                id: 5,
                name: 'icon',
                template_url: 'views/grid/icon_column.html'
            }],
            data: $scope.locations,
            fixedToolbar: true,
            selectedColumnIds: [1, 2, 3, 4,5],
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

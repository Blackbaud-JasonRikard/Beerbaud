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
        $scope.currentRegion = 'South Carolina';

        $scope.gridOptions = {
            columns: [{
                caption: 'Name',
                jsonmap: 'brewery.name',
                id: 2,
                name: 'brewery'
            }, {
                caption: 'Street Address',
                jsonmap: 'streetAddress',
                id: 4,
                name: 'streetAddress'
            }, {
                caption: 'City',
                jsonmap: 'locality',
                id: 3,
                name: 'locality'
            }, {
                caption: 'Website',
                jsonmap: 'brewery',
                id: 5,
                name: 'website',
                template_url: 'views/grid/website_column.html'
            }, {
                caption: 'Icon',
                jsonmap: 'brewery.images',
                id: 1,
                name: 'icon',
                template_url: 'views/grid/icon_column.html'
            }],
            data: $scope.locations,
            fixedToolbar: true,
            selectedColumnIds: [1, 2, 3, 4, 5],
            sortOptions: {
                excludedColumns: [
                    'streetAddress',
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



        //column sorting logic
        $scope.$watch(function() {
            return $scope.gridOptions.sortOptions;
        }, function() {
            $scope.gridOptions.data.sort(function(a, b) {
                var descending = $scope.gridOptions.sortOptions.descending ? -1 : 1,
                    sortProperty = $scope.gridOptions.sortOptions.column;
                    //sort breweries differently since it's an object
                if (sortProperty === 'brewery') {
                    if (a[sortProperty].name > b[sortProperty].name) {
                        return (descending);
                    } else if (a[sortProperty].name < b[sortProperty].name) {
                        return (-1 * descending);
                    } else {
                        return 0;
                    }
                } else {
                    if (a[sortProperty] > b[sortProperty]) {
                        return (descending);
                    } else if (a[sortProperty] < b[sortProperty]) {
                        return (-1 * descending);
                    } else {
                        return 0;
                    }
                }
            });
        }, true);

        //trigger a region change and table reload
        $scope.regionChanged = function(region) {
            $scope.currentRegion = region;
            loadLocationTable();
        };

		//Loads or resets the bb-grid with the currently selected region
        function loadLocationTable() {
            $scope.gridOptions.loading = true;
            breweryDB.getLocations($scope.currentRegion).then(function(locations) {
                $scope.locations = locations.data;
                $scope.gridOptions.loading = false;
                $scope.gridOptions.data = $scope.locations.slice(0, $scope.paginationOptions.itemsPerPage);

                $scope.$broadcast('reInitGrid');
                $scope.paginationOptions.recordCount = locations.totalResults;
                $scope.paginationOptions.currentPage = 1;
            });
        }

        loadLocationTable();
    });

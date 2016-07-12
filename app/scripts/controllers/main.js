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
        $scope.paginationOptions = { itemsPerPage: 25 };
        $scope.currentRegion = 'North Carolina';

        $scope.gridOptions = {
            columns: [{
                caption: 'Name',
                jsonmap: 'brewery',
                id: 2,
                name: 'name',
                controller: 'BreweryNameColCtrl as breweryNameCtrl',
                template_url: 'views/grid/brewery_name_column.html'
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
                jsonmap: 'brewery.website',
                id: 5,
                name: 'website',
                template_url: 'views/grid/website_column.html'
            }, {
                caption: 'Icon',
                jsonmap: 'brewery.images.icon',
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
            hideFilters: true,
            filters: {},
            loading: true,
            hasMoreRows: true
        };

        $scope.$on('loadMoreRows', function(event, data) {
            $scope.gridOptions.loading = true;
            loadNextPage().then(function(result) {
                var rows = [];
                //build rows
                angular.forEach(result.data, function(value) {
                    rows.push({
                        'icon': (value.brewery.images) ? value.brewery.images.icon : '',
                        'website': (value.brewery.website) ? value.brewery.website : '',
                        'name': (value.brewery) ? value.brewery : '',
                        'locality': (value.locality) ? value.locality : '',
                        'streetAddress': (value.streetAddress) ? value.streetAddress : '',
                    });
                });
                data.promise.resolve(rows);
                $scope.gridOptions.loading = false;
            });

            //Check to see if we need to load the next page from the API
            //if we have less locations than the api result total and we have skipped past all that we have loaded
            // if ($scope.locations.length < $scope.paginationOptions.recordCount && data.skip >= $scope.locations.length) {
            //     //load the next page of data from the API
            //     data.promise.resolve(loadNextPage(data.skip));
            // } else {
            //     $scope.gridOptions.data = getPaginationDataSet(data.top, data.skip);
            //     $scope.gridOptions.loading = false;
            // }
        });

        // function getPaginationDataSet(top, skip) {
        //     return $scope.locations.slice(skip, (top + skip));
        // }



        //column sorting logic
        $scope.$watch(function() {
            return $scope.gridOptions.sortOptions;
        }, function() {
            $scope.gridOptions.data.sort(function(a, b) {
                var descending = $scope.gridOptions.sortOptions.descending ? -1 : 1,
                    sortProperty = $scope.gridOptions.sortOptions.column;
              
                return a[sortProperty].localeCompare(b[sortProperty]) * descending;

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
            breweryDB.getLocations($scope.currentRegion, 1).then(function(locations) {
                $scope.locations = locations.data;
                $scope.gridOptions.loading = false;
                $scope.gridOptions.data = $scope.locations.slice(0, $scope.paginationOptions.itemsPerPage);

                $scope.$broadcast('reInitGrid');
                $scope.paginationOptions.recordCount = locations.totalResults;
                $scope.paginationOptions.currentPage = 1;
            });
        }

        function loadNextPage() {
            $scope.paginationOptions.currentPage++;
            return breweryDB.getLocations($scope.currentRegion, $scope.paginationOptions.currentPage);
        }

        loadLocationTable();


        

    }).controller('BreweryNameColCtrl', function($scope,bbModal){
    	this.open = function(data) {
    		$scope.brewery = data;
            bbModal.open({
                controller: 'BrewerydetailsCtrl as contentCtrl',
                templateUrl: 'views/brewerydetails.html',
                scope: $scope
            });
        };
    });

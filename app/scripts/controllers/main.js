'use strict';

/**
 * @ngdoc function
 * @name beerbaudApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beerbaudApp
 */
angular.module('beerbaudApp')
    .controller('MainCtrl', function($scope) {

    	var dataSet1 = {};

        $scope.paginationOptions = {
            recordCount: 10
        };

        $scope.gridOptions2 = {
            columns: [{
                caption: 'Name',
                jsonmap: 'name',
                id: 1,
                name: 'name'
            }, {
                caption: 'Address',
                jsonmap: 'address',
                id: 2,
                name: 'address'
            }, {
                caption: 'Website',
                jsonmap: 'website',
                id: 3,
                name: 'website'
            }, {
                caption: 'Icon',
                jsonmap: 'icon',
                id: 4,
                name: 'icon'
            }],
            data: dataSet1,
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
            filters: {}
        };

        $scope.$on('loadMoreRows', function(event, data) {
            $scope.gridOptions2.data = getPaginationDataSet(data.top, data.skip);
        });

        function getPaginationDataSet(top, skip) {
            if (skip === 0 || skip === 15) {
                return dataSet1;
            } else if (skip === 5 || skip === 20) {
                // return dataSet2;
            } else {
                // return dataSet3;
            }
        }

    });

'use strict';

describe('Controller: BrewerydetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('beerbaudApp'));

  var BrewerydetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BrewerydetailsCtrl = $controller('BrewerydetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BrewerydetailsCtrl.awesomeThings.length).toBe(3);
  });
});

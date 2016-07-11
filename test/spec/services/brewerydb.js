'use strict';

describe('Service: breweryDB', function () {

  // load the service's module
  beforeEach(module('beerbaudApp'));

  // instantiate service
  var breweryDB;
  beforeEach(inject(function (_breweryDB_) {
    breweryDB = _breweryDB_;
  }));

  it('should do something', function () {
    expect(!!breweryDB).toBe(true);
  });

});

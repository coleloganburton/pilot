'use strict';

describe('fltplans E2E Tests:', function () {
  describe('Test fltplans page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/fltplans');
      expect(element.all(by.repeater('fltplan in fltplans')).count()).toEqual(0);
    });
  });
});

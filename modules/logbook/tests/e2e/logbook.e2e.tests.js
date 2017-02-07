'use strict';

describe('Logbook E2E Tests:', function () {
  describe('Test logbook page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/logbook');
      expect(element.all(by.repeater('logbook in logbook')).count()).toEqual(0);
    });
  });
});

'use strict';

(function () {
  // logbook Controller Spec
  describe('Logbook Controller Tests', function () {
    // Initialize global variables
    var LogbookController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Logbook,
      mockLogbook;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Logbook_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Logbook = _Logbook_;

      // create mock Logbook
      mockLogbook = new Logbook({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Logbook about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Logbook controller.
      LogbookController = $controller('LogbookController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one logbook object fetched from XHR', inject(function (Logbook) {
      // Create a sample logbook array that includes the new logbook
      var sampleLogbook = [mockLogbook];

      // Set GET response
      $httpBackend.expectGET('api/logbook').respond(sampleLogbook);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.logbook).toEqualData(sampleLogbook);
    }));

    it('$scope.findOne() should create an array with one logbook object fetched from XHR using a logbookId URL parameter', inject(function (Logbook) {
      // Set the URL parameter
      $stateParams.logbookId = mockLogbook._id;

      // Set GET response
      $httpBackend.expectGET(/api\/logbook\/([0-9a-fA-F]{24})$/).respond(mockLogbook);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.logbook).toEqualData(mockLogbook);
    }));

    describe('$scope.create()', function () {
      var sampleLogbookPostData;

      beforeEach(function () {
        // Create a sample logbook object
        sampleLogbookPostData = new Logbook({
          title: 'An Logbook about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An logbook about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Logbook) {
        // Set POST response
        $httpBackend.expectPOST('api/logbook', sampleLogbookPostData).respond(mockLogbook);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the logbook was created
        expect($location.path.calls.mostRecent().args[0]).toBe('logbook/' + mockLogbook._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/logbook', sampleLogbookPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock logbook in scope
        scope.logbook = mockLogbook;
      });

      it('should update a valid logbook', inject(function (Logbook) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/logbook\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/logbook/' + mockLogbook._id);
      }));

      it('should set scope.error to error response message', inject(function (Logbook) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/logbook\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(logbook)', function () {
      beforeEach(function () {
        // Create new logbook array and include the logbook
        scope.logbook = [mockLogbook, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/logbook\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockLogbook);
      });

      it('should send a DELETE request with a valid logbookId and remove the logbook from the scope', inject(function (Logbook) {
        expect(scope.logbook.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.logbook = mockLogbook;

        $httpBackend.expectDELETE(/api\/logbook\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to logbook', function () {
        expect($location.path).toHaveBeenCalledWith('logbook');
      });
    });
  });
}());

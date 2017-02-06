'use strict';

(function () {
  // fltplans Controller Spec
  describe('fltplans Controller Tests', function () {
    // Initialize global variables
    var fltplansController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Fltplans,
      mockfltplan;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Fltplans_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Fltplans = _Fltplans_;

      // create mock fltplan
      mockfltplan = new Fltplans({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An fltplan about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the fltplans controller.
      fltplansController = $controller('fltplansController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one fltplan object fetched from XHR', inject(function (fltplans) {
      // Create a sample fltplans array that includes the new fltplan
      var samplefltplans = [mockfltplan];

      // Set GET response
      $httpBackend.expectGET('api/fltplans').respond(samplefltplans);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.fltplans).toEqualData(samplefltplans);
    }));

    it('$scope.findOne() should create an array with one fltplan object fetched from XHR using a fltplanId URL parameter', inject(function (fltplans) {
      // Set the URL parameter
      $stateParams.fltplanId = mockfltplan._id;

      // Set GET response
      $httpBackend.expectGET(/api\/fltplans\/([0-9a-fA-F]{24})$/).respond(mockfltplan);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.fltplan).toEqualData(mockfltplan);
    }));

    describe('$scope.create()', function () {
      var samplefltplanPostData;

      beforeEach(function () {
        // Create a sample fltplan object
        samplefltplanPostData = new Fltplans({
          title: 'An fltplan about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An fltplan about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (fltplans) {
        // Set POST response
        $httpBackend.expectPOST('api/fltplans', samplefltplanPostData).respond(mockfltplan);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the fltplan was created
        expect($location.path.calls.mostRecent().args[0]).toBe('fltplans/' + mockfltplan._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/fltplans', samplefltplanPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock fltplan in scope
        scope.fltplan = mockfltplan;
      });

      it('should update a valid fltplan', inject(function (fltplans) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/fltplans\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/fltplans/' + mockfltplan._id);
      }));

      it('should set scope.error to error response message', inject(function (fltplans) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/fltplans\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(fltplan)', function () {
      beforeEach(function () {
        // Create new fltplans array and include the fltplan
        scope.fltplans = [mockfltplan, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/fltplans\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockfltplan);
      });

      it('should send a DELETE request with a valid fltplanId and remove the fltplan from the scope', inject(function (fltplans) {
        expect(scope.fltplans.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.fltplan = mockfltplan;

        $httpBackend.expectDELETE(/api\/fltplans\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to fltplans', function () {
        expect($location.path).toHaveBeenCalledWith('fltplans');
      });
    });
  });
}());

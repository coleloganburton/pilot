'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication, test) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    /*
    $scope.posts = [
      { title: 'post 1', upvotes: 11 },
      { title: 'post 2', upvotes: 22 },
      { title: 'post 3', upvotes: 36 },
      { title: 'post 4', upvotes: 44 },
      { title: 'post 5', upvotes: 5 }
    ];

    $scope.addPost = function () {
      if(!$scope.title || $scope.title === '') { return; }
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0
      });
      $scope.title = '';
    };
    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
    */
  }
]);

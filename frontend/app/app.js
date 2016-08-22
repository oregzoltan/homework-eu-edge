var myEuEdgeApp = angular.module('euEdgeApp', ['ngRoute','ngDialog']);

myEuEdgeApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'euEdgeController'
    })
    .when('/directory', {
      templateUrl: 'views/directory.html',
      controller: 'euEdgeController'
    }).otherwise({
      redirectTo: '/directory'
    });
}]);

myEuEdgeApp.controller('euEdgeController', ['$scope', '$http', 'ngDialog', function($scope, $http, ngDialog) {

  function personMaker() {
    return {
      name: 'Nigel',
      job: 'boss',
      age: 35,
      nick: 'Nig',
      employee: false
    };
  }

  $http.get('http://localhost:3000/list').success(function(data) {
    $scope.persons = data;
    $scope.dataDump = JSON.stringify(data);
  });

  $scope.addPerson = function() {
    dialog = ngDialog.open({
      template: 'views/popup.html',
      className: 'ngdialog',
      scope: $scope,
     });

    var personToAdd = personMaker();
    $scope.persons.push(personToAdd);
    $http.post('http://localhost:3000/list/', personToAdd).success(function(data) {
      $scope.dataDump = JSON.stringify(data);
    });
  };

  $scope.removePerson = function(person) {
    var removedPerson = $scope.persons.indexOf(person);
    $scope.persons.splice(removedPerson, 1);
    $http.delete('http://localhost:3000/list/' + removedPerson).success(function(data) {
      $scope.dataDump = JSON.stringify(data);
    });
  };
}]);

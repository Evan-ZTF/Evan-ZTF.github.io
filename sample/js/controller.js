angular.module('myApp', ['myApp.controllers'])
  .controller('state1listController', function($scope, $state) {
    $scope.items = ["A", "List", "Of", "Items"];

  })
  .controller('state2listController', function($scope, $state) {

    $scope.things = ["A", "Set", "Of", "Things"];
  })

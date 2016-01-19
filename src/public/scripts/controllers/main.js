'use strict';

angular.module("mapDragon")
.controller('mainCtrl', function($scope, dataService){
  dataService.getData(function(response){
    $scope.data = response.data;
  });
});

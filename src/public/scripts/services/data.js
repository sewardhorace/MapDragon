'use strict';

angular.module('mapDragon')
.service('dataService', function($http){
  this.getData = function(callback){
    $http.get('static/mock/data.json')
    .then(callback);
  }
});

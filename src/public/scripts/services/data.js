'use strict';

angular.module('mapDragon')
.service('dataService', function($http){
  // this.getReports = [{"title":"butts"},{"title":"boobs"}];
  this.getData = function(callback){
    $http.get('static/mock/data.json')
    .then(callback);
  }
});

'use strict';

angular.module('mapDragon')
.directive('map', function(){
  return {
    templateUrl:'static/templates/map.html',
    controller:'mainCtrl',
    replace: true
  };
});

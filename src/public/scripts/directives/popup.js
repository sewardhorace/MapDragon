'use strict';

angular.module('mapDragon')
.directive('popup', function(){
  return {
    templateUrl:'static/templates/popup.html',
    replace: true,
    link: function(scope, elem, attrs){

    }
  };
});

'use strict';

angular.module('mapDragon')
.directive('map', function(canvasService, steadingFactory){
  return {
    templateUrl:'static/templates/map.html',
    controller:'mainCtrl',
    replace: true,
    link: function(scope, elem, attrs){
      console.log("map directive loaded");

      scope.canvasState = canvasService;
      scope.canvasState.initCanvas(elem[0]);

      var image = new Image();
      image.src = 'static/assets/cowboyspritestrip.png';

      scope.canvasState.addSteading(new steadingFactory({
        x: 60,
        y: 140,
        img: image,
        name: "Title",
        width: 64
      }));

    }
  };
});

/*
 * Lazy programmer : lot of StackOverflow behind this ;)
 * To draw a rough circle, used this http://jomacinc.com/map-radius/
 * Use @mapbox/plyline to encode the path following Google's Encoded Polyline Algorithm Format http://code.google.com/apis/maps/documentation/utilities/polylinealgorithm.html
**/
const polyline = require("@mapbox/polyline");

function getPoints(center,radius, precision){
  //Low probability of distorsion if huge radius and/or use in polar areas
  const π = Math.PI;
  const step = 360/precision;

  var lat  = (center.lat * π) / 180;
  var lng  = (center.lng * π) / 180;
  var diameter = radius / 6367.5; //average Earth radius in km


  var points=[];

  for (var i=0;i<=360;i+=step){
    var tmp = i*π/180;
    var point = {
      lat: Math.asin(Math.sin(lat)*Math.cos(diameter) + Math.cos(lat)*Math.sin(diameter)*Math.cos(tmp))
    };
    point.lng = ((lng + Math.atan2(Math.sin(tmp)*Math.sin(diameter)*Math.cos(lat), Math.cos(diameter)-Math.sin(lat)*Math.sin(point.lat))) * 180) / π;
    point.lat = point.lat*180/π;

    points.push(point);
  }
  return points;
}

module.exports = {
  /**
  * Center : {lat:float, lng:float}
  * Radius in km
  * Precision : how many points over the 360°
  **/
  getCircleEncodedPath:function(center, radius, precision){
    return polyline.encode(getPoints(center, radius, precision).map(function(coord){return [coord.lat, coord.lng];}));
  }
};

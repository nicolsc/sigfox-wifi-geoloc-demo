const request = require('request-promise');
const circle = require('./circle');
const DEFAULT_ZOOM=14;
const getLocation = function(sigfoxMessage){
  return new Promise(function(resolve, reject){
    var body = {
      "considerIp": "false",
      "wifiAccessPoints":
        sigfoxMessage.wifiNetworks.map(function(net){
          return {"macAddress":net};
        })
    };
    //console.log(body);
    request.post({
      uri: "https://www.googleapis.com/geolocation/v1/geolocate?key="+process.env.GOOGLE_KEY,
      json:true,
      body:body
    })
    .then(function(entry){
      if (entry.location && entry.location.lat !== undefined && entry.location.lng !== undefined){
        entry.location.lat = Math.floor(entry.location.lat * 10000) / 10000;
        entry.location.lng = Math.floor(entry.location.lng * 10000) / 10000;
      }
      entry.maps = [];
      entry.maps.push(getGmapsStaticImgCircle(entry));
      entry.maps.push(getGmapsStaticImgMarker(entry, 12));
      entry.mapLink="http://maps.google.com/maps?q="+entry.location.lat+","+entry.location.lng;
      resolve(entry);
    })
    .catch(reject);
  });
};

const getGmapsBaseURI = function(zoom){
  //https://maps.googleapis.com/maps/api/staticmap?center=51.477222,0&zoom=14&size=400x400
  const base = "https://maps.googleapis.com/maps/api/staticmap?";
  const params = {
    zoom:zoom || DEFAULT_ZOOM,
    size:"1200x800"
  };
  var uri = base;
  var key;
  for (key in params){
    uri += key+"="+params[key]+"&";
  }
  return uri;
};
const getGmapsStaticImgCircle = function(entry, zoom){
  var uri = getGmapsBaseURI(zoom);

  uri += "path=weight:0|fillcolor:0x23006688|enc:"+circle.getCircleEncodedPath(entry.location, entry.accuracy*0.001, 60);
  return uri;
};
const getGmapsStaticImgMarker = function(entry, zoom){
  var uri = getGmapsBaseURI(zoom);
  uri += "markers=color:0x230066%7Clabel:S%7C"+entry.location.lat+","+entry.location.lng;
  return uri;
};
module.exports = {
  location: function(sigfoxMsg){
    return new Promise(function(resolve, reject){
      getLocation(sigfoxMsg)
      .then(function(computed){
        return resolve(Object.assign(sigfoxMsg,computed));
      })
      .catch(reject);
    });
  }
};

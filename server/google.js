const request = require('request-promise');
const circle = require('./circle');
const getWifiLocation = function(sigfoxMessage){
  return new Promise(function(resolve, reject){
    var body = {
      "considerIp": "false",
      "wifiAccessPoints":
        sigfoxMessage.wifiNetworks.map(function(net){
          return {"macAddress":net};
        })
    };
    request.post({
      uri: "https://www.googleapis.com/geolocation/v1/geolocate?key="+process.env.GOOGLE_KEY,
      json:true,
      body:body
    })
    .then(function(entry){

      resolve(getMessageWithMaps(Object.assign(sigfoxMessage, entry)));
    })
    .catch(reject);
  });
};

const getGmapsBaseURI = function(zoom){
  //https://maps.googleapis.com/maps/api/staticmap?center=51.477222,0&zoom=14&size=400x400
  const base = "https://maps.googleapis.com/maps/api/staticmap?";
  const params = {
    zoom:zoom,
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
  uri += "path=weight:0|fillcolor:0x23006688|enc:"+circle.getCircleEncodedPath(entry.location, entry.location.radius*0.001, 180);
  return uri;
};
const getGmapsStaticImgMarker = function(entry, zoom){
  var uri = getGmapsBaseURI(zoom);
  uri += "markers=color:0x230066%7Clabel:S%7C"+entry.location.lat+","+entry.location.lng;
  return uri;
};
const getMessageWithMaps = function(entry){
  if (entry.location && entry.location.lat !== undefined && entry.location.lng !== undefined){
    entry.location.lat = Math.floor(entry.location.lat * 10000) / 10000;
    entry.location.lng = Math.floor(entry.location.lng * 10000) / 10000;
  }
  if (entry.type == 'wifi'){
    entry.location.radius = entry.accuracy;
  }

  var zooms = {
    close : entry.type=='wifi' ? 14 : 12,
    outer : 12
  };

  entry.maps = [];
  entry.maps.push(getGmapsStaticImgCircle(entry, zooms.close));
  entry.maps.push(getGmapsStaticImgMarker(entry, zooms.outer));
  entry.mapLink="http://maps.google.com/maps?q="+entry.location.lat+","+entry.location.lng;

  return entry;
}
module.exports = {
  locationWifi: function(sigfoxMsg){
    return new Promise(function(resolve, reject){
      getWifiLocation(sigfoxMsg)
      .then(function(computed){
        return resolve(Object.assign(sigfoxMsg,computed));
      })
      .catch(reject);
    });
  },
  locationSpotit: function(sigfoxMsg){
    return Promise.resolve(Object.assign(sigfoxMsg,getMessageWithMaps(sigfoxMsg)));
  }
};

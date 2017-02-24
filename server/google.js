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
    console.log(body);
    request.post({
      uri: "https://www.googleapis.com/geolocation/v1/geolocate?key="+process.env.GOOGLE_KEY,
      json:true,
      body:body
    })
    .then(function(entry){resolve(getGmapsStaticImg(entry))})
    .catch(reject);
  });
};

const getGmapsStaticImg = function(entry, zoom){
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

  uri += "path=weight:0|fillcolor:0x23006688|enc:"+circle.getCircleEncodedPath(entry.location, entry.accuracy*0.001, 60);

  console.log(uri);
  entry.map = uri;
  return entry;
};
module.exports = {
  location: function(sigfoxMsg){
    return new Promise(function(resolve, reject){
      getLocation(sigfoxMsg)
      .then(function(location){
        return resolve(Object.assign(sigfoxMsg, location));
      })
      .catch(reject);
    });
  }
};

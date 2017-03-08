const moment = require('moment');
const decodeSigfoxWifiMessage = function(payload){
  //12 bytes payload, with 2 6-bytes Wifi Access Points MAC Address (6 bytes = 12 hex chars)
  return payload.match(/.{1,12}/g).map(function(net){return net.match(/.{1,2}/g).join(':');});
};

module.exports = {
  message: function(requestBody, type){
    var msgDate = requestBody.time ? requestBody.time*1000 : new Date().getTime();
    var message = {
      type: type,
      date: {
        timestamp: msgDate,
        fromNow : moment(msgDate).fromNow(),
        calendar: moment(msgDate).calendar()
      },
      device : requestBody.device,
      payload : requestBody.data
    };
    if (message.type=='wifi'){
      message.wifiNetworks = decodeSigfoxWifiMessage(requestBody.data);
    }

    if (message.type=='spotit'){
      message.location = {lat: requestBody.lat, lng: requestBody.lng};
      if (requestBody.radius){
        message.location.radius = requestBody.radius;
      }
    }
    return message;
  }
}

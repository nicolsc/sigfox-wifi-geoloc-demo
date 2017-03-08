const Slack = require('node-slack')
function getSlackMessage(sigfoxMessage){
  var text = ""

  var username;
  switch(sigfoxMessage.type){
    case 'wifi':
      username = 'Wifi Geolocation';
      break;
    case 'spotit':
      username = 'Spotit Service';
      break;
    default: username = "Slack bot";
  }

  if (!sigfoxMessage.maps || !sigfoxMessage.maps.length){
    return {
      username: username += " Geolocation Failed",
      text: "❌ No location retrieved for *"+sigfoxMessage.device+"*\n\tWifi Networks : _" + sigfoxMessage.wifiNetworks.join("_ & _")+"_",
    };
  }
  var attachments = [{
    title:"Last message received "+sigfoxMessage.date.calendar,
    color:"#230066",
    text: "Location: \n\tLat: "+sigfoxMessage.location.lat+"\n\tLng: "+sigfoxMessage.location.lng+"\n(accuracy "+sigfoxMessage.location.radius+"m)\n"+sigfoxMessage.mapLink
  }];
  sigfoxMessage.maps.forEach(function(item){
    attachments.push({
      fallback:"Image not found ",
      image_url:item
    });
  });

  return {
    text: "Where is device *"+sigfoxMessage.device+"* ?",
    attachments: attachments,
    username: username
  };
}


module.exports = {
  post:function(sigfoxMessage){
    var slack = new Slack('https://hooks.slack.com/services/'+process.env.SLACK_TOKEN);
    var message = getSlackMessage(sigfoxMessage);
    slack.send(message, function(err, res){
      if (err){
            console.log("❌ Slack : ", err.message);
      }
      else{
        console.log("✅ Slack : ", res);
      }
    });
  }
}

const Slack = require('node-slack')
function getSlackMessage(sigfoxMessage){
  var text = ""
  if (!sigfoxMessage.map){
    return {
      username: "Wifi Geolocation Failed",
      text: "❌ No location retrieved for *"+sigfoxMessage.device+"*\n\tWifi Networks : _" + sigfoxMessage.wifiNetworks.join("_ & _")+"_",
    }
  }
  return {
    text: "Where is device *"+sigfoxMessage.device+"* ?",
    attachments: [
      {
          title:"Last message received "+sigfoxMessage.date.calendar,
          color:"#230066",
          text: "Location: \n\tLat: "+sigfoxMessage.location.lat+"\n\tLng: "+sigfoxMessage.location.lng+"\n(accuracy "+sigfoxMessage.accuracy+"m)"
      },
      {
        fallback:"Image not found ",
        image_url:sigfoxMessage.map.replace(/zoom\=([0-9]*)?\&/, 'zoom=12&')
      },
      {
        fallback:"Image not found ☹",
        image_url:sigfoxMessage.map
      }
    ]
  };
}


module.exports = {
  post:function(sigfoxMessage){
    var slack = new Slack('https://hooks.slack.com/services/'+process.env.SLACK_TOKEN);
    var message = getSlackMessage(sigfoxMessage);
    message.username = message.username || "Wifi Geolocation";

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

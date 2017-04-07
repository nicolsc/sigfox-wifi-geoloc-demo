# Server side application

### Local Setup

Make sure you have nodeJS properly installed on your system

Then run `$ npm install` to install the dependencies

`$ npm run`will start the server.

Make sure you properly set the following environnement variables :
* `GOOGLE_KEY` your key to use Google's apis
* `SLACK_TOKEN` the private part of your [Slack Webhook](https://api.slack.com/incoming-webhooks) URL

### Deploy online
You can easily deploy on Heroku, using the following commands under your root directory:
* `$ heroku apps:create your-app-name`
* `$ heroku config:set --app your-app-name  GOOGLE_KEY=xxxxxx SLACK_TOKEN=yyyyy/zzzz`
* `$ git push heroku master`

### Sigfox setup

Once you're application is deployed online (Heroku or else where, doesn't matter), add a callback on the [Sigfox backend](http://backend.sigfox.com) with the following settings :

* Channel : `URL`
* Type : `DATA/UPLINK `
* URL : `http://example.com/locations`
* Method : `POST`
* Content-Type : `application/json`
* Request body : `{"device":"{device}", "time":"{time}", "data":"{data}"}`

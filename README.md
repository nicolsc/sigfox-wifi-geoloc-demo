#Wifi+Sigfox based geolocation démo

##Purpose

* Gather the MAC address of the two "strongest" wifi networks
* Send them over the Sigfox network
* Use Google Geolocation API to get an approximate location
* Publish to Slack a Google Maps snapshot of the computed location

This a *demo* and not intended to be used in production.  
This does not tackle

* Battery optimisation
* Code robustness
* Data compression
* ...

##Hardware

Using a [SiPy](https://www.pycom.io/product/sipy/) from Pycom, which combines Sigfox & Wifi connectivities.

The SiPy is programmed in micropython, find the sample code in the [sipy](./sipy) folder

##Cloud application

Basic nodeJS application, which receive the Sigfox callback & calls the Google & Slack apis  

Check the [server](./server) folder

##Slack notification

Here is the kind of notification that you will receive :

![Slack screenshot](slack-screenshot.png)
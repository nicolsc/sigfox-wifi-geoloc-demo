#SiPy - Retrieve wifi networks around


Use the onboard WiFi chip to scan accessible Wifi networks locally.

Sort them, and select the two _strongest_ ones, based on the Received Signal Strength Intensity.

Use the onboard Sigfox module to send these two Mac adresses to our [application server](./server).  
Sigfox allows for a 12-byte useful payload, so we can send two 6-bytes mac adresses over the network.  
Another way would be to send 2 messages (= 24 bytes) so we can combine MAC Address + RSSI for higher precision

##How to

Upload the following files to your [SiPy]() :
* `main.py`
* `sigfox.py`
* `wifiscan.py`

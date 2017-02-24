import pycom
import wifiscan
import sigfox


pycom.heartbeat(False)
networks = wifiscan.get_two_strongest()
sigfox.send(networks)
pycom.rgbled(0x003300)
#pycom.rgbled(False)

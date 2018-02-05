#import pycom
from network import WLAN

def get_two_strongest():


    wlan = WLAN(mode=WLAN.STA)
    nets = wlan.scan()

    nets = sorted(nets,  key=lambda x:x.rssi,  reverse=True)
    #filter networks matching specific pattern. Example : temp networks set up for an event
    #nets = list(filter(lambda x: not "unahack" in x.ssid,  nets))

    #for net in nets:
    #   print(net.ssid,  "\t", binascii.hexlify(net.bssid, ":").decode(),  "\t", net.rssi)

    if not len(nets):
        #No wifi networks
        return []
    elif len(nets) ==1:
        #Only one wifi network
        return nets[0].bssid
    else:
        return nets[0].bssid + nets[1].bssid

import socket
from network import Sigfox
#import pycom

def sigfox_config(RCZ):
    # init Sigfox with the right RCZ
    sigfox = Sigfox(mode=Sigfox.SIGFOX, rcz=RCZ)
    print(sigfox.id())
    # create a Sigfox socket
    s = socket.socket(socket.AF_SIGFOX, socket.SOCK_RAW)
    # make the socket blocking
    s.setblocking(True)
    # configure it as uplink only
    s.setsockopt(socket.SOL_SIGFOX, socket.SO_RX, False)

    return s


def send(networks):
    sigfox = sigfox_config(Sigfox.RCZ1)
    sigfox.send(networks)



#print('Device ID :  ',  binascii.hexlify(sigfox.id()).decode())

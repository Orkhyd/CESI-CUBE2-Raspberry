import network
import json
import bme280
from machine import Pin, I2C
import urequests

print("Send DATA")
#Connection
wlan = network.WLAN(network.STA_IF)
wlan.active(True)

#Ssid/Password
ssid='Le Mordor'
password='BilbonSacquet'
wlan.connect(ssid,password)

#Send data
I2C_ADDR=0x27
i2c=I2C(0,sda=machine.Pin(0),scl=machine.Pin(1),freq=400000)
bme=bme280.BME280(i2c=i2c)
temperature=bme.values[0]
humidity=bme.values[2]

url="https://sonde.up.railway.app/recordings"
mac= "abcd1234"

data={'macAddress':mac,'hygrometry':humidity,'temperature':temperature}
json_data=json.dumps(data)
headers={"Content-Type":"application/json"}
response=urequests.post(url,headers=headers,data=json_data)

if response.status_code == 200 :
    print("Données envoyées !")
else:
    print("Une erreur est survenue")

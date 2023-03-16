import network   # handles connecting to WiFi
import ujson
import urequests # handles making and servicing network requests
import bme280        #importing BME280 library
from machine import Pin, I2C        #importing relevant modules & classes
import time
from secrets import *

print("2. Querying send data:")
# Connect to network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)

# Fill in your network name (ssid) and password here:
ssid = secrets['ssid']
password = secrets['password']
wlan.connect(ssid, password)

while True:
    try:
        I2C_ADDR = 0x27
        i2c = I2C(0, sda=machine.Pin(0), scl=machine.Pin(1), freq=400000)
        bme = bme280.BME280(i2c=i2c)        #BME280 object created
        temperature = bme.values[0]         #reading the value of temperature
        temperature=str(temperature)[:-1]
        humidity = bme.values[2]            #reading the value of humidity
        humidity=str(humidity)[:-1]
        pressure = bme.values[1]            #reading the value of pressure
        pressure=str(pressure)[:-3]
        
        mac = network.WLAN().config('mac')
        macs = str(mac).replace('\\x', '').upper()[3:-1]
        url = "http://140.238.217.125:3000/recordings"
        
        datapost = ujson.dumps({'macAddress': macs, 'hygrometry': humidity, 'temperature': temperature, 'pressure': pressure})
        response = urequests.post(url, headers = {'content-type': 'application/json'} , data=datapost)
        
        if response.status_code==200:
            print('Données envoyés avec succés !')
            print('Attendre 6 secondes !')
        response.close()
        time.sleep(6)
            
    except:
        print('erreur')
        time.sleep(240)
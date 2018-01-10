#!/usr/bin/env python3
from os import environ
import redis
import uuid
import sys, termios, tty, os
import time

def getVin():
  if environ.get('VIN') is None:
    environ["VIN"] = uuid.uuid4().hex

  return environ['VIN']

def initRedis():
  return redis.StrictRedis(host='localhost', port=6379, db=0)

def initPubSub(redisInstance):
  return redisInstance.pubsub()#ignore_subscribe_messages=True

def getFileName():
  return "./data/VIR-BMW-E92.csv"

def getSubscriptionName():
  return "Engine-Sensors"

def getch():
  fd = sys.stdin.fileno()
  old_settings = termios.tcgetattr(fd)
  try:
      tty.setraw(sys.stdin.fileno())
      ch = sys.stdin.read(1)

  finally:
      termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
  return ch

def getSampleRate():
  return 0.3

def getChannels():
  return ["Eng Oil Temp"
          ,"Eng Oil Pres"
          ,"GPS Altitude"
          ,"GPS Latitude"
          ,"GPS Longitude"
          ,"Eng Coolant Pres"
          ,"Gbox Oil Temp"
          ,"Fuel Pres"
          ,"Bat Volts ECU"
          ,"Engine RPM"
          ]

def channelPublish(sensorName, sensorValue):
  return {"vin":getVin(),"sensorname":sensorName,"datavalue":sensorValue,"timestamp":time.time()}

def getServiceEndpoint():
  if environ.get('ENDPOINT') is None:
    return "https://sensordata.apps.cloudyaws.io"
  else:
    return environ.get('ENDPOINT')
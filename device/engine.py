#!/usr/bin/env python3
import pandas as pd
from thread import start_new_thread
import time
import requests
import util
import sys
from pprint import pprint

TOTAL_LINES = 1200
START_LINE = 2
_lineNum = START_LINE
_redis = None

def getSensorData(sensorName, lineNum):
  sensorData = pd.read_csv(util.getFileName(),header=0, usecols=[sensorName] ,nrows=(lineNum+1), squeeze=True)
  #print(sensorData)
  if sensorData is None:
    _lineNum = START_LINE
    return None

  return sensorData[lineNum]

def publishSensorData(redis, sensorNames, lineNum):
  for sensorName in sensorNames:
    sensorData = getSensorData(sensorName=sensorName, lineNum=lineNum)
    redis.publish(util.getSubscriptionName(), util.channelPublish(sensorName=sensorName,sensorValue=sensorData))
    time.sleep(util.getSampleRate())
  return

def startSensorData():
  global _lineNum
  global _redis

  while _lineNum < TOTAL_LINES:
    publishSensorData(redis=_redis, sensorNames=util.getChannels(), lineNum=_lineNum)
    _lineNum = _lineNum + 1
  return

def stop():
  print("Stopping engine")
  _lineNum = TOTAL_LINES

  headers = {'content-type': 'application/json'}
  try:
    r = requests.delete(util.getServiceEndpoint() + "/engine/" + util.getVin(),headers=headers)
  except Exception as error:
    print("  Error posting engine to server")
    pprint(vars(error))
    print(vars(r.request))
    pprint(vars(r))
    raise Exception("Error posting engine endpoint")
  else:
    if r.status_code is not 200:
      print("  Data was not posted to endpoint")
      print(vars(r.request))
      pprint(vars(r))
      raise Exception("Endpoint did not return 200")
    else:
      pass

  print("Engine stopped")
  return
def sendEngineSpec():
  print("  Sending engine spec")

  #convert to a string
  channelList = ",".join(util.getChannels())
  data = "{\"vin\":\""+util.getVin()+"\",\"sensors\":\""+channelList+"\"}"

  headers = {'content-type': 'application/json'}
  try:
    r = requests.post(util.getServiceEndpoint() + "/engine",headers=headers, data=data)
  except Exception as error:
    print("  Error posting engine to server")
    pprint(vars(error))
    print(vars(r.request))
    pprint(vars(r))
    raise Exception("Error adding engine")
  else:
    if r.status_code is not 200:
      print("  Data was not posted to endpoint")
      print(vars(r.request))
      pprint(vars(r))
      raise Exception("Endpoint did not return 200")
    else:
      pass

  print("  Sent successfully")
  return
def test_engine():
  #check endpoint
  print("Starting engine test")
  try:
    print("  Sending GET to " + util.getServiceEndpoint() + "/engine")
    r = requests.get(util.getServiceEndpoint() + "/engine")
  except Exception as error:
    pprint(vars(error))
    raise Exception("Error testing engine endpoint")
  else:
    if r.status_code is not 200:
      print(vars(r.request))
      pprint(vars(r))
      raise Exception("Endpoint did not pass healthcheck")
    else:
      print("  200 Passed")

  print("End engine test")
  return
def start(redis):
  global _lineNum
  global _redis

  print("Starting engine")

  sendEngineSpec()
  _redis = redis
  start_new_thread(startSensorData,())
  
  print("Engine started")
  return
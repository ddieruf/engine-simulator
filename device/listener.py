#!/usr/bin/env python3
import requests
import util
import sys
from pprint import pprint

_thread = None

def start(pubsub):
  global _thread
  print("Starting listener")
  sampleRate = util.getSampleRate()#in seconds

  pubsub.subscribe(**{util.getSubscriptionName(): messageHandler})
  _thread = pubsub.run_in_thread(sleep_time=sampleRate)

  print("Listener started")
  return

def stop():
  print("Stopping listener")
  global _thread

  if _thread is not None: 
    _thread.stop()

  print("Listener stopped")
  return

def messageHandler(message):
  #print(message["data"])
  
  #POST to server
  headers = {'content-type': 'application/json'}
  try:
    r = requests.post(util.getServiceEndpoint() + "/sensordata",headers=headers, data=message["data"])
  except Exception as error:
    print("Error posting data to server")
    pprint(vars(error))
    print(vars(r.request))
    pprint(vars(r))
  else:
    if r.status_code is not 200:
      print("Data was not posted to endpoint")
      print(vars(r.request))
      pprint(vars(r))
    else:
      pass

  return

def test_listener():
  #check endpoint
  print("Starting listener test")
  try:
    print("  Sending GET to " + util.getServiceEndpoint() + "/sensordata")
    r = requests.get(util.getServiceEndpoint() + "/sensordata")
  except Exception as error:
    pprint(vars(error))
    raise Exception("Error testing listener endpoint")
  else:
    if r.status_code is not 200:
      print(vars(r.request))
      pprint(vars(r))
      raise Exception("Endpoint did not pass healthcheck")
    else:
      print("  200 Passed")

  print("End listener test")
  return
#!/usr/bin/env python3
import argparse
import engine
import atexit
import util
import listener
import website

_pubsub = None
_pyRedis = None

@atexit.register
def closeApp():
  global _pubsub
  global _pyRedis

  print("Application closing")

  website.stop()
  engine.stop()
  listener.stop()

  if _pubsub is not None:
    _pubsub.close()#end the pubsub

  #if _pyRedis is not None:
  #  _pyRedis.flushall()#save db to disk
  return

def initApp():
  global _pubsub
  global _pyRedis
  print("VIN: " + util.getVin())

  print("Initializing cache")
  _pyRedis = util.initRedis()
  _pubsub = util.initPubSub(_pyRedis)
  print("Done initializing")

  return

def test_cache(pyRedis):
  print("Testing cache server")

  print("  Put value 'I am a value'")
  pyRedis.set('test', 'I am a value')

  print("  Get value")
  print("  " + pyRedis.get('test'))

  print("Done testing")
  return

if __name__ == "__main__":
  print("Application start")

  parser = argparse.ArgumentParser(prog='python parse', description='Do cool stuff')
  parser.add_argument("-n", "--noinit", help="Do not perform init",action="store_true")
  parser.add_argument("-e", "--notest", help="Do not perform tests on init",action="store_true")
  #parser.add_argument("-s", "--startwebsite", help="Start the web site",action="store_false")
  #parser.add_argument("-t", "--stopwebsite", help="Stop the web site",action="store_false")
  #parser.add_argument("-e", "--fillcache", help="Fill the cache with values",action="store_true")
  #parser.add_argument("-e", "--startengine", help="Start sampling sensors",action="store_false")
  args = parser.parse_args()

  #initialize app and verify
  if args.noinit is False:
    initApp()

  if args.notest is False:
    test_cache(_pyRedis)
    listener.test_listener()
    engine.test_engine()
  
  #website.start()
  listener.start(_pubsub)
  engine.start(_pyRedis)
  
  #while True:
  #  char = util.getch()
 
  #  if (char == "q"):
  #    engine.stop()
  #    listener.stop()
  #    exit(0)
    
  #  if (char == "l"):
  #    listener.stop()

  #  if (char == "e"):
  #    engine.stop()
from flask import Flask, render_template
from thread import start_new_thread

app = Flask('engin-simulator',template_folder='html', static_folder='html')

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

def start():
  global app
  app.run(host="0.0.0.0",port=8080,debug=True)
  return

def stop():
  global app
  app = None
  return
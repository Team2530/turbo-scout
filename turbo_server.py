from base64 import b64encode
from datetime import datetime
from hashlib import md5
from json import dumps, loads
from os import listdir, makedirs
from random import choice
from string import ascii_letters
from time import time

from flask import Flask, request
from flask_cors import CORS, cross_origin

app: Flask = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
start_time: float = time()

# Create the turbo-data directory, unless it already exists
makedirs("turbo-data", exist_ok=True)


def round(n, decimals=1):
  import math
  m = 10**decimals
  return math.floor(n * m + 0.5) / m


@app.route('/')
@cross_origin()
def route_root():
  return {'status': "running", 'uptime': round(time() - start_time, 3)}


@app.route('/push', methods=['POST'])
@cross_origin()
def route_push():
  content_type: str | None = request.headers.get('Content-Type')

  if content_type is None or content_type != 'application/json':
    app.logger.error(f"Push had invalid content-type of '{content_type}'")
    return {'message': "Invalid content-type! Expected JSON."}

  data: str = dumps(request.json, separators=(',', ':'))

  if data is None:
    app.logger.error("Push had invalid request data!")
    return {'message': "Invalid request data!"}

  encoded_date: str = b64encode(bytes(datetime.now().isoformat(),
                                      'utf-8')).decode('ascii')
  random_sequence: str = ''.join(
      choice(ascii_letters + '0123456789') for i in range(6))
  with open(f"turbo-data/data-{encoded_date}-{random_sequence}.json",
            "w") as f:
    f.write(data)
  return {'hash': md5(data.encode('ISO-8859-1')).hexdigest()}


@app.route('/pull')
@cross_origin()
def route_pull():
  app.logger.info("Data pull requested.")
  result: list = []
  paths: list[str] = listdir("turbo-data")
  for path in paths:
    with open("turbo-data/" + path, "r") as file:
      result.append(loads(file.read()))
  return result


if __name__ == '__main__':
  app.logger.info("Starting server...")
  app.run(host='0.0.0.0', port=8888)

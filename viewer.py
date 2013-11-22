import os
from flask import Flask, jsonify, render_template

import json
sfmuni_code = json.loads(open('sfmuni.json','r').read())

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('viewer.html')

@app.route('/sfmuni.json')
def sfmuni():
    return jsonify(sfmuni_code)

if __name__ == '__main__':
    app.config.update(DEBUG=True,
        PROPAGATE_EXCEPTIONS=True,
        TESTING=True,
        SERVER_NAME='localhost:8000')
    app.run()

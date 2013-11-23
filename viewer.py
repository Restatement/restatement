import os
from flask import Flask, jsonify, render_template, request

import json
# Load legal code from JSON file right when server starts
sfmuni_code = json.loads(open('sfmuni.json','r').read())
# Index each clause
def index_code(code):
    index = {}
    for item in code:
        index[item['uid']] = item
        index.update(index_code(item['children']))
    return index

sfmuni_index = index_code(sfmuni_code['content'])

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('viewer.html')

@app.route('/clause/<clause>/')
def clause(clause):
    return render_template('viewer.html',base_clause=clause)

@app.route('/sfmuni.json')
def sfmuni():
    if request.args.get('base'):
        return jsonify({
                'title': request.args.get('base'),
                'content': sfmuni_index[int(request.args.get('base'))]
        })
    return jsonify(sfmuni_code)

if __name__ == '__main__':
    app.config.update(DEBUG=True,
        PROPAGATE_EXCEPTIONS=True,
        TESTING=True,
        SERVER_NAME='localhost:8000')
    app.run()

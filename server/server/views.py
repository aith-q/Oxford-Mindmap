from flask import render_template

from server import app

@app.route('/')
def index():
    return 'test'

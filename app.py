from flask import Flask, render_template, jsonify
import random
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/flip')
def flip():
    # Simulate a tiny delay for "network" feel (optional)
    time.sleep(0.1)
    
    # 0 = Heads, 1 = Tails
    # We send the raw choice to the frontend
    choice = random.choice(['heads', 'tails'])
    
    return jsonify({
        'result': choice,
        'status': 'success'
    })

if __name__ == '__main__':
    app.run(debug=True)
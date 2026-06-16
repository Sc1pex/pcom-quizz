import json
import sqlite3
import os
import hashlib
import subprocess
from flask import Flask, send_from_directory, request, jsonify, send_file

app = Flask(__name__, static_folder='.', static_url_path='')

def init_db():
    conn = sqlite3.connect('quizzes.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS quizzes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            options TEXT NOT NULL,
            correctIndex INTEGER NOT NULL,
            explanation TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    conn = sqlite3.connect('quizzes.db')
    c = conn.cursor()
    c.execute('SELECT question, options, correctIndex, explanation FROM quizzes')
    rows = c.fetchall()
    conn.close()
    
    quizzes = []
    for r in rows:
        quizzes.append({
            'question': r[0],
            'options': json.loads(r[1]),
            'correctIndex': r[2],
            'explanation': r[3]
        })
    return jsonify(quizzes)

@app.route('/api/quizzes', methods=['POST'])
def add_quiz():
    data = request.json
    if not isinstance(data, list):
        data = [data]
        
    conn = sqlite3.connect('quizzes.db')
    c = conn.cursor()
    for q in data:
        c.execute('''
            INSERT INTO quizzes (question, options, correctIndex, explanation)
            VALUES (?, ?, ?, ?)
        ''', (q.get('question'), json.dumps(q.get('options')), q.get('correctIndex'), q.get('explanation')))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success'})

@app.route('/api/tts', methods=['POST'])
def generate_tts():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
        
    # Generate unique filename based on hash of the text
    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
    os.makedirs('tts_cache', exist_ok=True)
    filename = os.path.join('tts_cache', f'{text_hash}.mp3')
    
    if not os.path.exists(filename):
        # Generate using edge-tts
        try:
            subprocess.run(["edge-tts", "--voice", "ro-RO-EmilNeural", "--text", text, "--write-media", filename], check=True)
        except subprocess.CalledProcessError as e:
            return jsonify({'error': 'TTS generation failed'}), 500
            
    return send_file(filename, mimetype="audio/mpeg")

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)

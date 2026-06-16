import json
import sqlite3
from flask import Flask, send_from_directory, request, jsonify

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

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)

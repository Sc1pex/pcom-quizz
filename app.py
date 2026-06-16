import os
import json
import sqlite3
import hashlib
import subprocess
from flask import Flask, send_from_directory, request, jsonify, render_template, session, redirect, url_for, send_file

app = Flask(__name__, static_folder='.', static_url_path='')

# Configure secret key for sessions
app.secret_key = os.environ.get('SECRET_KEY', 'pcom-quizz-secret-key-default-1928374')

# Retrieve the admin password from environment variables
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')

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

    # Seed the database from quizzes.js if it is currently empty
    c.execute('SELECT COUNT(*) FROM quizzes')
    count = c.fetchone()[0]
    if count == 0:
        try:
            with open('quizzes.js', 'r', encoding='utf-8') as f:
                content = f.read().strip()
            start = content.find('[')
            end = content.rfind(']') + 1
            if start != -1 and end != -1:
                json_str = content[start:end]
                default_quizzes = json.loads(json_str)
                for q in default_quizzes:
                    c.execute('''
                        INSERT INTO quizzes (question, options, correctIndex, explanation)
                        VALUES (?, ?, ?, ?)
                    ''', (q.get('question'), json.dumps(q.get('options')), q.get('correctIndex'), q.get('explanation')))
                conn.commit()
                print(f"Seeded {len(default_quizzes)} quizzes into the database.")
        except Exception as e:
            print(f"Error seeding database from quizzes.js: {e}")
            
    conn.close()

@app.before_request
def protect_sensitive_files():
    path = request.path.lower()
    blocked = [
        'app.py',
        'quizzes.db',
        'dockerfile',
        'requirements.txt',
        '.git'
    ]
    # Block direct download of template files or any sensitive system files
    if path.startswith('/templates') or any(b in path for b in blocked):
        return "Access Denied", 403

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    # If the password isn't set in the environment, block access and warn
    if not ADMIN_PASSWORD:
        return "Autentificarea este dezactivată deoarece parola de administrator nu este configurată în variabilele de mediu.", 500

    if request.method == 'POST':
        entered_password = request.form.get('password')
        if entered_password == ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            return redirect(url_for('admin'))
        else:
            return render_template('login.html', error='Parolă incorectă!')

    if session.get('admin_logged_in') == True:
        return render_template('admin.html')
    
    return render_template('login.html')

@app.route('/admin/logout', methods=['POST'])
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin'))

@app.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    conn = sqlite3.connect('quizzes.db')
    c = conn.cursor()
    c.execute('SELECT id, question, options, correctIndex, explanation FROM quizzes')
    rows = c.fetchall()
    conn.close()
    
    quizzes = []
    for r in rows:
        quizzes.append({
            'id': r[0],
            'question': r[1],
            'options': json.loads(r[2]),
            'correctIndex': r[3],
            'explanation': r[4]
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

@app.route('/api/quizzes/<int:quiz_id>', methods=['PUT'])
def edit_quiz(quiz_id):
    if session.get('admin_logged_in') != True:
        return jsonify({'error': 'Unauthorized'}), 401
        
    data = request.json
    question = data.get('question')
    options = data.get('options')
    correctIndex = data.get('correctIndex')
    explanation = data.get('explanation')
    
    if not question or not options or correctIndex is None:
        return jsonify({'error': 'Missing required fields'}), 400
        
    conn = sqlite3.connect('quizzes.db')
    c = conn.cursor()
    c.execute('''
        UPDATE quizzes
        SET question = ?, options = ?, correctIndex = ?, explanation = ?
        WHERE id = ?
    ''', (question, json.dumps(options), correctIndex, explanation, quiz_id))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success'})

@app.route('/api/quizzes/<int:quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    if session.get('admin_logged_in') != True:
        return jsonify({'error': 'Unauthorized'}), 401
        
    conn = sqlite3.connect('quizzes.db')
    c = conn.cursor()
    c.execute('DELETE FROM quizzes WHERE id = ?', (quiz_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success'})

@app.route('/api/tts', methods=['POST'])
def generate_tts():
    data = request.json
    text = data.get('text', '')
    voice = data.get('voice', 'ro-RO-EmilNeural')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
        
    # Generate unique filename based on hash of the voice and text
    text_hash = hashlib.md5(f"{voice}_{text}".encode('utf-8')).hexdigest()
    os.makedirs('tts_cache', exist_ok=True)
    filename = os.path.join('tts_cache', f'{text_hash}.mp3')
    
    if not os.path.exists(filename):
        # Generate using edge-tts
        try:
            subprocess.run(["edge-tts", "--voice", voice, "--text", text, "--write-media", filename], check=True)
        except subprocess.CalledProcessError as e:
            return jsonify({'error': 'TTS generation failed'}), 500
            
    return send_file(filename, mimetype="audio/mpeg")

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)


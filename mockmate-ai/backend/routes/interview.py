from flask import Blueprint, request, jsonify
from utils.gemini_helper import generate_interview_questions, get_feedback, get_hint, evaluate_code, get_assistant_response
import json
import os
from datetime import datetime

interview_bp = Blueprint('interview', __name__)

SESSIONS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'sessions.json')

def _ensure_data_dir():
    os.makedirs(os.path.dirname(SESSIONS_FILE), exist_ok=True)
    if not os.path.exists(SESSIONS_FILE):
        with open(SESSIONS_FILE, 'w') as f:
            json.dump([], f)

def _load_sessions():
    _ensure_data_dir()
    with open(SESSIONS_FILE, 'r') as f:
        return json.load(f)

def _save_sessions(sessions):
    _ensure_data_dir()
    with open(SESSIONS_FILE, 'w') as f:
        json.dump(sessions, f, indent=2)

@interview_bp.route('/generate', methods=['POST'])
def generate():
    data = request.json
    role = data.get('role')
    topic = data.get('topic')
    difficulty = data.get('difficulty')
    
    questions_json = generate_interview_questions(role, topic, difficulty)
    try:
        questions = json.loads(questions_json)
        return jsonify({"questions": questions})
    except:
        return jsonify({"error": "Failed to parse questions", "raw": questions_json}), 500

@interview_bp.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    question = data.get('question')
    answer = data.get('answer')
    
    feedback_json = get_feedback(question, answer)
    try:
        feedback_data = json.loads(feedback_json)
        return jsonify(feedback_data)
    except:
        return jsonify({"error": "Failed to parse feedback", "raw": feedback_json}), 500

@interview_bp.route('/hint', methods=['POST'])
def hint():
    data = request.json
    question = data.get('question')
    hint_text = get_hint(question)
    return jsonify({"hint": hint_text})

@interview_bp.route('/evaluate-code', methods=['POST'])
def eval_code():
    data = request.json
    problem_title = data.get('title', '')
    problem_desc = data.get('description', '')
    code = data.get('code', '')
    language = data.get('language', 'javascript')
    
    result_json = evaluate_code(problem_title, problem_desc, code, language)
    try:
        result = json.loads(result_json)
        return jsonify(result)
    except:
        return jsonify({"error": "Failed to parse evaluation", "raw": result_json}), 500

@interview_bp.route('/save-session', methods=['POST'])
def save_session():
    data = request.json
    sessions = _load_sessions()
    
    session = {
        "id": len(sessions) + 1,
        "type": data.get('type', 'interview'),
        "role": data.get('role', ''),
        "topic": data.get('topic', ''),
        "score": data.get('score', 0),
        "date": datetime.now().strftime('%Y-%m-%d %H:%M'),
        "questions_count": data.get('questions_count', 0),
        "duration_seconds": data.get('duration_seconds', 0)
    }
    
    sessions.append(session)
    # Keep last 50 sessions
    sessions = sessions[-50:]
    _save_sessions(sessions)
    
    return jsonify({"success": True, "session": session})

@interview_bp.route('/history', methods=['GET'])
def history():
    sessions = _load_sessions()
    
    # Calculate aggregate stats
    total = len(sessions)
    avg_score = round(sum(s.get('score', 0) for s in sessions) / max(total, 1), 1)
    total_time = sum(s.get('duration_seconds', 0) for s in sessions)
    total_questions = sum(s.get('questions_count', 0) for s in sessions)
    
    return jsonify({
        "sessions": sessions[-20:],  # Last 20
        "stats": {
            "total_sessions": total,
            "avg_score": avg_score,
            "total_time_hours": round(total_time / 3600, 1),
            "total_questions": total_questions
        }
    })

@interview_bp.route('/assistant', methods=['POST'])
def assistant():
    data = request.json
    history = data.get('history', [])
    response = get_assistant_response(history)
    return jsonify({"response": response})


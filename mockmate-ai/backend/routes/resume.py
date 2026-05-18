from flask import Blueprint, request, jsonify
from utils.pdf_helper import extract_text_from_pdf
from utils.gemini_helper import analyze_resume
import json

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    text = extract_text_from_pdf(file)
    
    analysis_json = analyze_resume(text)
    try:
        analysis_data = json.loads(analysis_json)
        return jsonify(analysis_data)
    except:
        return jsonify({"error": "Failed to parse analysis", "raw": analysis_json}), 500

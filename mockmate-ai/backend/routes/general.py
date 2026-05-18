from flask import Blueprint, jsonify

general_bp = Blueprint('general', __name__)

@general_bp.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "online", "version": "1.0.0"})

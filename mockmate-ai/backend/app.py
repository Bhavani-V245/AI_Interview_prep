import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Dynamic Python Path Injection for Serverless Runtimes
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Load environment variables
load_dotenv()

def create_app():
    # Configure app dynamically to serve static folder only if it exists (handles local vs vercel containers)
    static_dir = os.path.abspath(os.path.join(backend_dir, '../frontend/dist'))
    if os.path.exists(static_dir):
        app = Flask(__name__, static_folder=static_dir)
    else:
        app = Flask(__name__)
        
    CORS(app)

    # Import and register blueprints
    from routes.interview import interview_bp
    from routes.resume import resume_bp
    from routes.general import general_bp

    app.register_blueprint(interview_bp, url_prefix='/api/interview')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(general_bp, url_prefix='/api')

    # Serve the frontend (only if static folder exists)
    if os.path.exists(static_dir):
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve(path):
            if path != "" and os.path.exists(app.static_folder + '/' + path):
                return send_from_directory(app.static_folder, path)
            else:
                return send_from_directory(app.static_folder, 'index.html')
    else:
        @app.route('/')
        def api_root():
            return {"status": "success", "message": "MockMate AI Backend is perfectly active and running!"}

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)


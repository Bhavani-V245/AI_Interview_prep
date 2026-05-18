import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    # Configure app to serve the frontend dist folder
    app = Flask(__name__, static_folder='../frontend/dist')
    CORS(app)

    # Import and register blueprints
    from routes.interview import interview_bp
    from routes.resume import resume_bp
    from routes.general import general_bp

    app.register_blueprint(interview_bp, url_prefix='/api/interview')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(general_bp, url_prefix='/api')

    # Serve the frontend
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)

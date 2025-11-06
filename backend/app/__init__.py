from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Validate configuration
    config_errors = Config.validate()
    if config_errors:
        print("Configuration errors:")
        for error in config_errors:
            print(f"  - {error}")

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

    # Register blueprints
    from app.routes.chat import chat_bp
    from app.routes.config import config_bp
    from app.routes.transcript import transcript_bp
    from app.routes.plugins import plugins_bp
    from app.routes.voice import voice_bp

    app.register_blueprint(chat_bp, url_prefix='/api')
    app.register_blueprint(config_bp, url_prefix='/api/config')
    app.register_blueprint(transcript_bp, url_prefix='/api/transcript')
    app.register_blueprint(plugins_bp, url_prefix='/api/plugins')
    app.register_blueprint(voice_bp, url_prefix='/api/voice')

    # Health check
    @app.route('/api/health')
    def health():
        return {'status': 'healthy', 'model': Config.AI_MODEL_NAME}, 200

    return app

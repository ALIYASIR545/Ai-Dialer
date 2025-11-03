"""
Flask Application Entry Point
"""

from app import create_app

app = create_app()

if __name__ == '__main__':
    print("=" * 60)
    print("AI Dialer Backend Server")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print("API endpoints available at http://localhost:5000/api")
    print("=" * 60)

    # Pre-load the AI model before starting the server
    print("\nPre-loading AI model (this may take 2-5 minutes on first run)...")
    try:
        from app.ai.model_connector import get_model
        model = get_model()
        print("[OK] AI model loaded successfully!")
        print("=" * 60)
    except Exception as e:
        print(f"[WARNING] Could not pre-load model: {e}")
        print("Model will load on first request instead.")
        print("=" * 60)

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )

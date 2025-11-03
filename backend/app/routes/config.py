"""
Configuration API Routes
Handles user preferences and settings
"""

from flask import Blueprint, request, jsonify

config_bp = Blueprint('config', __name__)

# In-memory storage (replace with database in production)
user_preferences_store = {}


@config_bp.route('/preferences', methods=['GET'])
def get_preferences():
    """Get user preferences"""
    user_id = request.args.get('user_id', 'default')

    preferences = user_preferences_store.get(user_id, {
        'name': 'User',
        'avatar': None,
        'voicePreference': 'default',
        'tone': 'professional',
        'personality': 'assistant'
    })

    return jsonify(preferences), 200


@config_bp.route('/preferences', methods=['PUT'])
def update_preferences():
    """Update user preferences"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'default')

        # Update or create preferences
        if user_id not in user_preferences_store:
            user_preferences_store[user_id] = {}

        user_preferences_store[user_id].update(data)

        return jsonify({
            'success': True,
            'preferences': user_preferences_store[user_id]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@config_bp.route('/voices', methods=['GET'])
def get_voices():
    """Get available voice options"""
    voices = {
        'presets': [
            {
                'id': 'assistant',
                'name': 'Assistant',
                'description': 'Balanced and professional',
                'rate': 1.0,
                'pitch': 1.0
            },
            {
                'id': 'friendly',
                'name': 'Friendly',
                'description': 'Warm and conversational',
                'rate': 0.95,
                'pitch': 1.1
            },
            {
                'id': 'professional',
                'name': 'Professional',
                'description': 'Formal business tone',
                'rate': 0.9,
                'pitch': 0.95
            },
            {
                'id': 'energetic',
                'name': 'Energetic',
                'description': 'Upbeat and lively',
                'rate': 1.1,
                'pitch': 1.15
            },
            {
                'id': 'calm',
                'name': 'Calm',
                'description': 'Slow and soothing',
                'rate': 0.85,
                'pitch': 0.9
            }
        ]
    }

    return jsonify(voices), 200


@config_bp.route('/personalities', methods=['GET'])
def get_personalities():
    """Get available AI personalities"""
    personalities = [
        {
            'id': 'assistant',
            'name': 'Assistant',
            'description': 'Helpful and informative'
        },
        {
            'id': 'friendly',
            'name': 'Friendly',
            'description': 'Warm and conversational'
        },
        {
            'id': 'professional',
            'name': 'Professional',
            'description': 'Formal and business-like'
        },
        {
            'id': 'tutor',
            'name': 'Tutor',
            'description': 'Educational and patient'
        },
        {
            'id': 'creative',
            'name': 'Creative',
            'description': 'Imaginative and innovative'
        },
        {
            'id': 'coach',
            'name': 'Coach',
            'description': 'Motivational and action-oriented'
        }
    ]

    return jsonify(personalities), 200

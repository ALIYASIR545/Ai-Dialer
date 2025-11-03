"""
Chat API Routes
Handles conversation and message processing
"""

from flask import Blueprint, request, jsonify
from app.ai.model_connector import get_model
from app.ai.conversation_manager import ConversationManager
from app.ai.intent_detector import IntentDetector
from app.ai.universal_router import UniversalRouter
from app.ai.organization_configs import get_organization_config
from config import Config

chat_bp = Blueprint('chat', __name__)

# Initialize components
conversation_manager = ConversationManager()
intent_detector = IntentDetector()

# Initialize router with organization configuration
org_config = get_organization_config(Config.ORGANIZATION_TYPE)
if Config.ORGANIZATION_NAME:
    org_config['organization_name'] = Config.ORGANIZATION_NAME
universal_router = UniversalRouter(org_config)

# Lazy load model
_model = None


def get_ai_model():
    """Get or initialize AI model"""
    global _model
    if _model is None:
        _model = get_model()
    return _model


@chat_bp.route('/chat', methods=['POST'])
def chat():
    """
    Process chat message and return AI response

    Request body:
        message: User's message
        conversation_history: List of previous messages
        personality: AI personality type
        user_preferences: User preferences dict

    Returns:
        JSON response with AI message
    """
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400

        message = data.get('message')
        conversation_history = data.get('conversation_history', [])
        personality = data.get('personality', 'assistant')
        user_preferences = data.get('user_preferences', {})

        # Process message through conversation manager
        context = conversation_manager.process_message(
            message,
            conversation_history,
            personality,
            user_preferences
        )

        # Detect intent
        intent_result = intent_detector.detect(message)

        # Generate AI response
        model = get_ai_model()
        ai_response = model.generate_response(
            context['message'],
            context['history'],
            system_message=context['system_message']
        )

        # Check if plugin should be invoked
        plugin_suggestion = None
        if intent_result['has_intent']:
            plugin_suggestion = {
                'intent': intent_result['primary_intent'],
                'confidence': intent_result['intents'][0]['confidence'],
                'entities': intent_detector.extract_entities(
                    message,
                    intent_result['primary_intent']
                )
            }

        response = {
            'message': ai_response,
            'metadata': context['metadata'],
            'intent': intent_result,
            'plugin_suggestion': plugin_suggestion
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'I apologize, but I encountered an error. Please try again.'
        }), 500


@chat_bp.route('/route-call', methods=['POST'])
def route_call():
    """
    Analyze request and route call to appropriate agent/department

    Request body:
        message: User's description of their issue/request

    Returns:
        JSON response with routing information and agent details
    """
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400

        message = data.get('message')

        # Analyze request and get routing recommendation
        routing_result = universal_router.analyze_request(message)

        # Get agent greeting
        greeting = universal_router.get_agent_greeting(
            routing_result['agent']
        )

        response = {
            'routing': routing_result,
            'greeting': greeting,
            'agent': routing_result['agent'],
            'organization': universal_router.get_organization_info()
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Error in route-call endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Internal server error',
            'message': 'Unable to route your call. Please try again.'
        }), 500


@chat_bp.route('/agents', methods=['GET'])
def get_agents():
    """
    Get list of all available agents/departments

    Returns:
        JSON response with list of agents
    """
    try:
        agents = universal_router.list_all_agents()
        organization = universal_router.get_organization_info()
        return jsonify({
            'agents': agents,
            'organization': organization
        }), 200

    except Exception as e:
        print(f"Error in agents endpoint: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'Unable to retrieve agents list.'
        }), 500


@chat_bp.route('/organization', methods=['GET'])
def get_organization():
    """
    Get organization information and configuration

    Returns:
        JSON response with organization details
    """
    try:
        from app.ai.organization_configs import list_available_configs

        organization = universal_router.get_organization_info()
        available_types = list_available_configs()

        return jsonify({
            'current': organization,
            'available_types': available_types
        }), 200

    except Exception as e:
        print(f"Error in organization endpoint: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'Unable to retrieve organization info.'
        }), 500


@chat_bp.route('/models', methods=['GET'])
def get_models():
    """Get available AI models"""
    from config import Config

    models = {
        'current': {
            'name': Config.AI_MODEL_NAME,
            'type': Config.AI_MODEL_TYPE
        },
        'available': {
            'huggingface': [
                'microsoft/DialoGPT-small',
                'microsoft/DialoGPT-medium',
                'microsoft/DialoGPT-large',
                'facebook/blenderbot-400M-distill',
                'facebook/blenderbot-1B-distill'
            ],
            'openai': [
                'gpt-3.5-turbo',
                'gpt-4',
                'gpt-4-turbo'
            ]
        }
    }

    return jsonify(models), 200

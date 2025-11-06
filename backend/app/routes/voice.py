"""
Twilio Voice API Routes
Handles voice call webhooks and TwiML generation
"""

from flask import Blueprint, request, jsonify, url_for
from app.services.twilio_service import get_twilio_service
from app.ai.model_connector import get_model
from app.ai.conversation_manager import ConversationManager
from app.ai.universal_router import UniversalRouter
from app.ai.organization_configs import get_organization_config
from config import Config

voice_bp = Blueprint('voice', __name__)

# Initialize components
conversation_manager = ConversationManager()
org_config = get_organization_config(Config.ORGANIZATION_TYPE)
if Config.ORGANIZATION_NAME:
    org_config['organization_name'] = Config.ORGANIZATION_NAME
universal_router = UniversalRouter(org_config)

# Store active call conversations (in production, use Redis or database)
active_conversations = {}


@voice_bp.route('/token', methods=['POST'])
def get_voice_token():
    """
    Generate Twilio access token for client-side calling

    Request body:
        identity: Unique identifier for the user

    Returns:
        JSON with access token
    """
    try:
        data = request.get_json()
        identity = data.get('identity', 'anonymous_user')

        twilio_service = get_twilio_service()
        if not twilio_service:
            return jsonify({
                'error': 'Twilio not configured'
            }), 500

        token = twilio_service.generate_access_token(identity)

        return jsonify({
            'token': token,
            'identity': identity
        }), 200

    except Exception as e:
        print(f"Error generating token: {e}")
        return jsonify({
            'error': 'Failed to generate access token'
        }), 500


@voice_bp.route('/incoming', methods=['POST'])
def handle_incoming_call():
    """
    Handle incoming voice call
    Twilio webhook - returns TwiML
    """
    try:
        # Get call information
        call_sid = request.form.get('CallSid')
        from_number = request.form.get('From')
        to_number = request.form.get('To')

        print(f"Incoming call from {from_number} to {to_number}, SID: {call_sid}")

        # Initialize conversation for this call
        active_conversations[call_sid] = {
            'history': [],
            'from_number': from_number,
            'agent': None
        }

        twilio_service = get_twilio_service()
        if not twilio_service:
            return twilio_service.generate_twiml_error(), 200, {'Content-Type': 'text/xml'}

        # Generate greeting TwiML
        org_name = org_config.get('organization_name', 'our company')
        greeting = f"Hello! Welcome to {org_name}. I'm your AI assistant."

        gather_url = url_for('voice.handle_speech', _external=True)
        twiml = twilio_service.generate_twiml_greeting(greeting, gather_url)

        return twiml, 200, {'Content-Type': 'text/xml'}

    except Exception as e:
        print(f"Error handling incoming call: {e}")
        import traceback
        traceback.print_exc()
        twilio_service = get_twilio_service()
        return twilio_service.generate_twiml_error(), 200, {'Content-Type': 'text/xml'}


@voice_bp.route('/speech', methods=['POST'])
def handle_speech():
    """
    Handle speech input from user
    Twilio webhook - returns TwiML with AI response
    """
    try:
        call_sid = request.form.get('CallSid')
        speech_result = request.form.get('SpeechResult', '')

        print(f"Speech from call {call_sid}: {speech_result}")

        if not speech_result:
            twilio_service = get_twilio_service()
            twiml = twilio_service.generate_twiml_response(
                "I'm sorry, I didn't catch that. Could you please repeat?",
                gather_url=url_for('voice.handle_speech', _external=True)
            )
            return twiml, 200, {'Content-Type': 'text/xml'}

        # Get conversation history
        conversation = active_conversations.get(call_sid, {
            'history': [],
            'agent': None
        })

        # First message - route the call
        if not conversation.get('agent'):
            routing_result = universal_router.analyze_request(speech_result)
            conversation['agent'] = routing_result['agent']
            conversation['department'] = routing_result['department']

            # Get agent greeting
            agent_greeting = universal_router.get_agent_greeting(routing_result['agent'])

            # Add to history
            conversation['history'].append({
                'role': 'user',
                'content': speech_result
            })
            conversation['history'].append({
                'role': 'assistant',
                'content': agent_greeting
            })

            active_conversations[call_sid] = conversation

            # Generate TwiML with agent greeting
            twilio_service = get_twilio_service()
            twiml = twilio_service.generate_twiml_response(
                agent_greeting,
                gather_url=url_for('voice.handle_speech', _external=True)
            )

            return twiml, 200, {'Content-Type': 'text/xml'}

        # Continue conversation with AI
        conversation['history'].append({
            'role': 'user',
            'content': speech_result
        })

        # Generate AI response
        model = get_model()
        context = conversation_manager.process_message(
            speech_result,
            conversation['history'],
            'assistant',
            {}
        )

        ai_response = model.generate_response(
            context['message'],
            context['history'],
            system_message=context['system_message']
        )

        conversation['history'].append({
            'role': 'assistant',
            'content': ai_response
        })

        active_conversations[call_sid] = conversation

        # Generate TwiML with AI response
        twilio_service = get_twilio_service()
        twiml = twilio_service.generate_twiml_response(
            ai_response,
            gather_url=url_for('voice.handle_speech', _external=True)
        )

        return twiml, 200, {'Content-Type': 'text/xml'}

    except Exception as e:
        print(f"Error handling speech: {e}")
        import traceback
        traceback.print_exc()
        twilio_service = get_twilio_service()
        return twilio_service.generate_twiml_error(), 200, {'Content-Type': 'text/xml'}


@voice_bp.route('/status', methods=['POST'])
def handle_call_status():
    """
    Handle call status updates
    Twilio webhook
    """
    try:
        call_sid = request.form.get('CallSid')
        call_status = request.form.get('CallStatus')

        print(f"Call {call_sid} status: {call_status}")

        # Clean up conversation when call ends
        if call_status in ['completed', 'failed', 'busy', 'no-answer']:
            if call_sid in active_conversations:
                del active_conversations[call_sid]
                print(f"Cleaned up conversation for call {call_sid}")

        return '', 200

    except Exception as e:
        print(f"Error handling call status: {e}")
        return '', 200


@voice_bp.route('/make-call', methods=['POST'])
def make_outbound_call():
    """
    Initiate an outbound call to a phone number

    Request body:
        to: Phone number to call
        request_text: User's request/reason for calling

    Returns:
        JSON with call SID and status
    """
    try:
        data = request.get_json()
        to_number = data.get('to')
        request_text = data.get('request_text', 'General assistance')

        if not to_number:
            return jsonify({
                'error': 'Phone number is required'
            }), 400

        # Clean phone number - remove spaces, dashes, parentheses
        to_number = to_number.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')

        twilio_service = get_twilio_service()
        if not twilio_service:
            return jsonify({
                'error': 'Twilio not configured'
            }), 500

        # Generate TwiML URL for outbound call
        # Use PUBLIC_URL if available (for tunneling), otherwise use _external
        if Config.PUBLIC_URL:
            twiml_url = f"{Config.PUBLIC_URL}/api/voice/incoming"
        else:
            twiml_url = url_for('voice.handle_incoming_call', _external=True)

        print(f"Using TwiML URL: {twiml_url}")

        # Make the call
        call_sid = twilio_service.create_call(to_number, twiml_url)

        return jsonify({
            'call_sid': call_sid,
            'status': 'initiated',
            'to': to_number
        }), 200

    except Exception as e:
        print(f"Error making outbound call: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to initiate call'
        }), 500


@voice_bp.route('/call-status/<call_sid>', methods=['GET'])
def get_call_status(call_sid):
    """
    Get status of a specific call

    Args:
        call_sid: Twilio Call SID

    Returns:
        JSON with call status
    """
    try:
        twilio_service = get_twilio_service()
        if not twilio_service:
            return jsonify({
                'error': 'Twilio not configured'
            }), 500

        status = twilio_service.get_call_status(call_sid)

        if not status:
            return jsonify({
                'error': 'Call not found'
            }), 404

        return jsonify(status), 200

    except Exception as e:
        print(f"Error getting call status: {e}")
        return jsonify({
            'error': 'Failed to get call status'
        }), 500

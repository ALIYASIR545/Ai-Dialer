"""
Twilio Voice Service
Handles real-time voice calls using Twilio
"""

from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather, Say
from config import Config


class TwilioService:
    """Service for handling Twilio voice operations"""

    def __init__(self):
        if not Config.TWILIO_ACCOUNT_SID or not Config.TWILIO_AUTH_TOKEN:
            raise ValueError("Twilio credentials not configured in .env file")

        self.client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)
        self.phone_number = Config.TWILIO_PHONE_NUMBER

    def create_call(self, to_number, twiml_url):
        """
        Initiate an outbound call

        Args:
            to_number: Phone number to call
            twiml_url: URL that returns TwiML instructions

        Returns:
            Call SID
        """
        try:
            call = self.client.calls.create(
                to=to_number,
                from_=self.phone_number,
                url=twiml_url,
                status_callback_event=['initiated', 'ringing', 'answered', 'completed'],
                status_callback_method='POST'
            )
            return call.sid
        except Exception as e:
            print(f"Error creating call: {e}")
            raise

    def generate_twiml_greeting(self, greeting_text, gather_url):
        """
        Generate TwiML for initial greeting and gather user input

        Args:
            greeting_text: Text to speak to user
            gather_url: URL to send speech-to-text results

        Returns:
            TwiML XML string
        """
        response = VoiceResponse()

        # Say greeting
        response.say(greeting_text, voice='Polly.Joanna', language='en-US')

        # Gather speech input
        gather = Gather(
            input='speech',
            action=gather_url,
            method='POST',
            speech_timeout='auto',
            language='en-US',
            hints='help, support, sales, billing, technical'
        )
        gather.say('Please tell me how I can help you today.', voice='Polly.Joanna')

        response.append(gather)

        # If no input, redirect
        response.say('I did not receive any input. Goodbye.', voice='Polly.Joanna')
        response.hangup()

        return str(response)

    def generate_twiml_response(self, ai_response, gather_url=None):
        """
        Generate TwiML for AI response

        Args:
            ai_response: Text response from AI
            gather_url: URL to gather next user input (if continuing conversation)

        Returns:
            TwiML XML string
        """
        response = VoiceResponse()

        # Say AI response
        response.say(ai_response, voice='Polly.Joanna', language='en-US')

        if gather_url:
            # Continue conversation - gather more input
            gather = Gather(
                input='speech',
                action=gather_url,
                method='POST',
                speech_timeout='auto',
                language='en-US'
            )
            gather.pause(length=1)
            response.append(gather)
        else:
            # End conversation
            response.say('Thank you for calling. Goodbye!', voice='Polly.Joanna')
            response.hangup()

        return str(response)

    def generate_twiml_error(self):
        """Generate TwiML for error handling"""
        response = VoiceResponse()
        response.say(
            'I apologize, but I encountered an error. Please try again later.',
            voice='Polly.Joanna'
        )
        response.hangup()
        return str(response)

    def get_call_status(self, call_sid):
        """
        Get status of a call

        Args:
            call_sid: Twilio Call SID

        Returns:
            Call status dict
        """
        try:
            call = self.client.calls(call_sid).fetch()
            return {
                'sid': call.sid,
                'status': call.status,
                'duration': call.duration,
                'from': call.from_,
                'to': call.to,
                'direction': call.direction
            }
        except Exception as e:
            print(f"Error fetching call status: {e}")
            return None

    def generate_access_token(self, identity):
        """
        Generate Twilio Access Token for client-side calling

        Args:
            identity: Unique identifier for the user

        Returns:
            Access token string
        """
        from twilio.jwt.access_token import AccessToken
        from twilio.jwt.access_token.grants import VoiceGrant

        # Create access token
        token = AccessToken(
            Config.TWILIO_ACCOUNT_SID,
            Config.TWILIO_ACCOUNT_SID,  # API Key SID (use Account SID if no API key)
            Config.TWILIO_AUTH_TOKEN,   # API Key Secret (use Auth Token if no API key)
            identity=identity
        )

        # Create a Voice grant
        voice_grant = VoiceGrant(
            outgoing_application_sid=Config.TWILIO_TWIML_APP_SID,
            incoming_allow=True
        )

        # Add grant to token
        token.add_grant(voice_grant)

        return token.to_jwt()


# Global instance
_twilio_service = None


def get_twilio_service():
    """Get or create Twilio service instance"""
    global _twilio_service
    if _twilio_service is None:
        try:
            _twilio_service = TwilioService()
        except ValueError as e:
            print(f"Twilio service not available: {e}")
            return None
    return _twilio_service

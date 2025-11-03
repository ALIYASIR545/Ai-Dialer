"""
Conversation Manager
Handles conversation context, history, and personalization
"""

from datetime import datetime


class ConversationManager:
    """Manages conversation state and context"""

    def __init__(self):
        self.conversations = {}  # Store conversations by session ID

    def process_message(self, message, conversation_history, personality='assistant', user_preferences=None):
        """
        Process a user message and prepare context for AI

        Args:
            message: User's message
            conversation_history: List of previous messages
            personality: AI personality type
            user_preferences: User preferences dict

        Returns:
            dict: Processed context
        """
        # Get personality system message
        system_message = self._get_personality_prompt(personality, user_preferences)

        # Process and clean message
        processed_message = self._preprocess_message(message)

        return {
            'message': processed_message,
            'system_message': system_message,
            'history': conversation_history,
            'metadata': {
                'personality': personality,
                'user_name': user_preferences.get('name', 'User') if user_preferences else 'User',
                'timestamp': datetime.now().isoformat()
            }
        }

    def _get_personality_prompt(self, personality, user_preferences=None):
        """Get system prompt based on personality type"""
        user_name = user_preferences.get('name', 'User') if user_preferences else 'User'
        tone = user_preferences.get('tone', 'professional') if user_preferences else 'professional'

        personalities = {
            'assistant': f"You are a helpful AI assistant speaking with {user_name}. Be {tone}, clear, and concise. Provide helpful and accurate information.",

            'friendly': f"You are a friendly and warm AI companion speaking with {user_name}. Be conversational, empathetic, and supportive. Use a casual but respectful tone.",

            'professional': f"You are a professional AI assistant speaking with {user_name}. Maintain a formal, business-like tone. Be precise, efficient, and solution-oriented.",

            'tutor': f"You are an educational AI tutor helping {user_name} learn. Explain concepts clearly, ask questions to check understanding, and encourage learning. Be patient and supportive.",

            'creative': f"You are a creative AI assistant helping {user_name}. Think outside the box, suggest innovative ideas, and encourage creative thinking. Be imaginative and inspiring.",

            'therapist': f"You are a supportive AI listener speaking with {user_name}. Be empathetic, non-judgmental, and help them explore their thoughts and feelings. Note: You are not a replacement for professional therapy.",

            'coach': f"You are a motivational AI coach helping {user_name} achieve their goals. Be encouraging, action-oriented, and help them stay accountable. Celebrate wins and provide constructive feedback."
        }

        return personalities.get(personality, personalities['assistant'])

    def _preprocess_message(self, message):
        """Clean and preprocess user message"""
        # Remove extra whitespace
        message = ' '.join(message.split())

        # Basic sanitization
        message = message.strip()

        return message

    def detect_intent(self, message):
        """
        Detect user intent from message

        Returns:
            dict: Intent information
        """
        message_lower = message.lower()

        intents = {
            'schedule': ['schedule', 'meeting', 'appointment', 'calendar', 'remind'],
            'summarize': ['summarize', 'summary', 'brief', 'tldr', 'recap'],
            'translate': ['translate', 'translation', 'in spanish', 'in french', 'in german'],
            'note': ['note', 'write down', 'remember', 'save this'],
            'search': ['search', 'find', 'look up', 'google'],
            'calculate': ['calculate', 'compute', 'math', 'plus', 'minus', 'multiply'],
        }

        detected_intents = []

        for intent_name, keywords in intents.items():
            if any(keyword in message_lower for keyword in keywords):
                detected_intents.append(intent_name)

        return {
            'intents': detected_intents,
            'has_intent': len(detected_intents) > 0,
            'primary_intent': detected_intents[0] if detected_intents else None
        }

    def format_conversation_for_export(self, conversation, format_type='text'):
        """
        Format conversation for export

        Args:
            conversation: List of messages
            format_type: Export format (text, json, markdown)

        Returns:
            str: Formatted conversation
        """
        if format_type == 'json':
            import json
            return json.dumps(conversation, indent=2)

        elif format_type == 'markdown':
            output = "# AI Dialer Conversation Transcript\n\n"
            output += f"**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"

            for msg in conversation:
                role = "User" if msg['role'] == 'user' else "AI Assistant"
                timestamp = datetime.fromtimestamp(msg['timestamp'] / 1000).strftime('%H:%M:%S')
                output += f"### {role} ({timestamp})\n\n{msg['content']}\n\n"

            return output

        else:  # text
            output = f"AI Dialer Conversation Transcript\n"
            output += f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            output += "=" * 50 + "\n\n"

            for msg in conversation:
                role = "USER" if msg['role'] == 'user' else "AI"
                timestamp = datetime.fromtimestamp(msg['timestamp'] / 1000).strftime('%H:%M:%S')
                output += f"[{timestamp}] {role}: {msg['content']}\n\n"

            return output

    def get_conversation_stats(self, conversation):
        """Get statistics about a conversation"""
        if not conversation:
            return {
                'total_messages': 0,
                'user_messages': 0,
                'ai_messages': 0,
                'duration_seconds': 0
            }

        user_messages = [m for m in conversation if m['role'] == 'user']
        ai_messages = [m for m in conversation if m['role'] == 'assistant']

        # Calculate duration
        if len(conversation) > 1:
            start_time = conversation[0]['timestamp']
            end_time = conversation[-1]['timestamp']
            duration = (end_time - start_time) / 1000  # Convert to seconds
        else:
            duration = 0

        return {
            'total_messages': len(conversation),
            'user_messages': len(user_messages),
            'ai_messages': len(ai_messages),
            'duration_seconds': duration
        }

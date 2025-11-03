"""
Intent Detector
Detects user intent and routes to appropriate plugins
"""

import re


class IntentDetector:
    """Detects intents from user messages"""

    def __init__(self):
        self.intent_patterns = self._initialize_patterns()

    def _initialize_patterns(self):
        """Initialize regex patterns for intent detection"""
        return {
            'schedule': {
                'patterns': [
                    r'schedule.*meeting',
                    r'book.*appointment',
                    r'set.*reminder',
                    r'add.*calendar',
                    r'remind me to'
                ],
                'keywords': ['schedule', 'meeting', 'appointment', 'calendar', 'reminder']
            },
            'summarize': {
                'patterns': [
                    r'summarize.*',
                    r'give me.*summary',
                    r'what.*tldr',
                    r'recap.*'
                ],
                'keywords': ['summarize', 'summary', 'tldr', 'recap', 'brief']
            },
            'translate': {
                'patterns': [
                    r'translate.*to\s+\w+',
                    r'how do you say.*in\s+\w+',
                    r'.*in\s+(spanish|french|german|italian|chinese|japanese)',
                ],
                'keywords': ['translate', 'translation', 'spanish', 'french', 'german']
            },
            'note': {
                'patterns': [
                    r'take.*note',
                    r'write.*down',
                    r'save.*for later',
                    r'remember.*'
                ],
                'keywords': ['note', 'write down', 'save', 'remember']
            },
            'search': {
                'patterns': [
                    r'search.*for',
                    r'find.*about',
                    r'look up',
                    r'google.*'
                ],
                'keywords': ['search', 'find', 'look up', 'google']
            }
        }

    def detect(self, message):
        """
        Detect intent from message

        Args:
            message: User's message

        Returns:
            dict: Intent detection results
        """
        message_lower = message.lower()
        detected = []

        for intent_name, config in self.intent_patterns.items():
            score = 0

            # Check regex patterns
            for pattern in config['patterns']:
                if re.search(pattern, message_lower):
                    score += 2

            # Check keywords
            for keyword in config['keywords']:
                if keyword in message_lower:
                    score += 1

            if score > 0:
                detected.append({
                    'intent': intent_name,
                    'confidence': min(score / 3, 1.0)  # Normalize to 0-1
                })

        # Sort by confidence
        detected.sort(key=lambda x: x['confidence'], reverse=True)

        return {
            'intents': detected,
            'primary_intent': detected[0]['intent'] if detected else None,
            'has_intent': len(detected) > 0
        }

    def extract_entities(self, message, intent):
        """
        Extract entities from message based on intent

        Args:
            message: User's message
            intent: Detected intent

        Returns:
            dict: Extracted entities
        """
        entities = {}

        if intent == 'schedule':
            entities = self._extract_schedule_entities(message)
        elif intent == 'translate':
            entities = self._extract_translation_entities(message)
        elif intent == 'note':
            entities = self._extract_note_entities(message)

        return entities

    def _extract_schedule_entities(self, message):
        """Extract scheduling-related entities"""
        entities = {}

        # Time patterns
        time_patterns = [
            (r'(\d{1,2}):(\d{2})\s*(am|pm)?', 'time'),
            (r'(tomorrow|today|next week|next month)', 'relative_date'),
            (r'(\d{1,2})/(\d{1,2})/(\d{4})', 'date')
        ]

        for pattern, entity_type in time_patterns:
            match = re.search(pattern, message.lower())
            if match:
                entities[entity_type] = match.group(0)

        # Extract title (everything between quotes or after "meeting about")
        title_match = re.search(r'"([^"]+)"', message)
        if title_match:
            entities['title'] = title_match.group(1)
        else:
            title_match = re.search(r'meeting about (.+)', message.lower())
            if title_match:
                entities['title'] = title_match.group(1)

        return entities

    def _extract_translation_entities(self, message):
        """Extract translation-related entities"""
        entities = {}

        # Target language
        lang_match = re.search(r'in\s+(\w+)', message.lower())
        if lang_match:
            entities['target_language'] = lang_match.group(1)

        # Text to translate (everything between quotes or after "translate")
        text_match = re.search(r'"([^"]+)"', message)
        if text_match:
            entities['text'] = text_match.group(1)
        else:
            text_match = re.search(r'translate\s+(.+?)\s+to', message.lower())
            if text_match:
                entities['text'] = text_match.group(1)

        return entities

    def _extract_note_entities(self, message):
        """Extract note-related entities"""
        entities = {}

        # Note content (everything after "note:" or between quotes)
        note_match = re.search(r'"([^"]+)"', message)
        if note_match:
            entities['content'] = note_match.group(1)
        else:
            note_match = re.search(r'note:?\s*(.+)', message.lower())
            if note_match:
                entities['content'] = note_match.group(1)

        return entities

    def should_invoke_plugin(self, intent_result):
        """
        Determine if a plugin should be invoked

        Args:
            intent_result: Result from detect()

        Returns:
            bool: Whether to invoke plugin
        """
        if not intent_result['has_intent']:
            return False

        # Only invoke if confidence is high enough
        if intent_result['intents'][0]['confidence'] >= 0.5:
            return True

        return False

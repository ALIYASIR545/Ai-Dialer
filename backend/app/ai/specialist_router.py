"""
Specialist Router
Analyzes caller symptoms and routes to appropriate specialist
"""

import re

class SpecialistRouter:
    """Routes calls to appropriate specialists based on symptoms/needs"""

    def __init__(self):
        self.specialists = self._load_specialists()
        self.symptom_keywords = self._load_symptom_keywords()

    def _load_specialists(self):
        """Load specialist database"""
        return {
            'cardiologist': {
                'name': 'Dr. Sarah Johnson',
                'title': 'Cardiologist',
                'department': 'Cardiology',
                'specialties': ['heart', 'chest pain', 'heart attack', 'cardiovascular'],
                'phone': '555-HEART',
                'availability': '24/7'
            },
            'pulmonologist': {
                'name': 'Dr. Michael Chen',
                'title': 'Pulmonologist',
                'department': 'Pulmonology',
                'specialties': ['lungs', 'breathing', 'asthma', 'respiratory', 'chest pain'],
                'phone': '555-LUNGS',
                'availability': '8 AM - 6 PM'
            },
            'orthopedic': {
                'name': 'Dr. Emily Rodriguez',
                'title': 'Orthopedic Surgeon',
                'department': 'Orthopedics',
                'specialties': ['bones', 'fracture', 'joint pain', 'back pain', 'sports injury'],
                'phone': '555-BONES',
                'availability': '24/7'
            },
            'neurologist': {
                'name': 'Dr. David Park',
                'title': 'Neurologist',
                'department': 'Neurology',
                'specialties': ['headache', 'migraine', 'seizure', 'stroke', 'brain', 'nerve'],
                'phone': '555-NEURO',
                'availability': '24/7'
            },
            'gastro': {
                'name': 'Dr. Lisa Martinez',
                'title': 'Gastroenterologist',
                'department': 'Gastroenterology',
                'specialties': ['stomach', 'abdomen', 'digestive', 'nausea', 'vomiting'],
                'phone': '555-GASTRO',
                'availability': '9 AM - 5 PM'
            },
            'emergency': {
                'name': 'Dr. James Wilson',
                'title': 'Emergency Medicine',
                'department': 'Emergency Room',
                'specialties': ['emergency', 'urgent', 'severe', 'critical', '911'],
                'phone': '911',
                'availability': '24/7'
            },
            'general': {
                'name': 'Dr. Amanda Taylor',
                'title': 'General Practitioner',
                'department': 'General Medicine',
                'specialties': ['general', 'checkup', 'consultation', 'advice'],
                'phone': '555-GENERAL',
                'availability': '24/7'
            }
        }

    def _load_symptom_keywords(self):
        """Load symptom-to-specialty mapping"""
        return {
            'chest pain': ['cardiologist', 'pulmonologist'],
            'heart': ['cardiologist'],
            'heart attack': ['emergency', 'cardiologist'],
            'shortness of breath': ['pulmonologist', 'cardiologist'],
            'breathing': ['pulmonologist'],
            'broken bone': ['orthopedic', 'emergency'],
            'fracture': ['orthopedic'],
            'back pain': ['orthopedic'],
            'joint pain': ['orthopedic'],
            'headache': ['neurologist'],
            'migraine': ['neurologist'],
            'seizure': ['emergency', 'neurologist'],
            'stroke': ['emergency', 'neurologist'],
            'stomach': ['gastro'],
            'nausea': ['gastro'],
            'vomiting': ['gastro'],
            'emergency': ['emergency'],
            'urgent': ['emergency'],
            'severe': ['emergency']
        }

    def analyze_symptoms(self, message):
        """
        Analyze user message to extract symptoms

        Args:
            message: User's description of their issue

        Returns:
            dict: Analysis results with detected symptoms and specialist recommendation
        """
        message_lower = message.lower()
        detected_symptoms = []
        potential_specialists = set()

        # Check for symptom keywords
        for symptom, specialists in self.symptom_keywords.items():
            if symptom in message_lower:
                detected_symptoms.append(symptom)
                potential_specialists.update(specialists)

        # If no specific symptoms, route to general
        if not potential_specialists:
            potential_specialists.add('general')
            detected_symptoms.append('general consultation')

        # Prioritize emergency if detected
        if 'emergency' in potential_specialists:
            specialist_key = 'emergency'
        else:
            # Get the first specialist from the set
            specialist_key = list(potential_specialists)[0]

        specialist = self.specialists[specialist_key]

        return {
            'detected_symptoms': detected_symptoms,
            'specialist_key': specialist_key,
            'specialist': specialist,
            'confidence': self._calculate_confidence(detected_symptoms),
            'routing_reason': self._get_routing_reason(detected_symptoms, specialist)
        }

    def _calculate_confidence(self, symptoms):
        """Calculate confidence score for routing decision"""
        if not symptoms:
            return 0.5
        if len(symptoms) >= 2:
            return 0.9
        return 0.7

    def _get_routing_reason(self, symptoms, specialist):
        """Generate human-readable routing reason"""
        if not symptoms:
            return f"Routing to {specialist['name']} for general consultation"

        symptom_list = ', '.join(symptoms)
        return f"Based on your symptoms ({symptom_list}), connecting you to {specialist['name']}, {specialist['title']}"

    def get_specialist_greeting(self, specialist):
        """Get personalized greeting from specialist"""
        return f"Hello, I'm {specialist['name']}, {specialist['title']} in the {specialist['department']} department. How can I help you today?"

    def list_all_specialists(self):
        """Return list of all available specialists"""
        return [
            {
                'key': key,
                'name': spec['name'],
                'title': spec['title'],
                'department': spec['department'],
                'availability': spec['availability']
            }
            for key, spec in self.specialists.items()
        ]

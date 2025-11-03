"""
Universal Router
Routes callers to appropriate departments/agents based on configurable organization settings
"""

import re
import json
import os


class UniversalRouter:
    """Routes calls to appropriate agents/departments based on organization configuration"""

    def __init__(self, organization_config=None):
        """
        Initialize router with organization configuration

        Args:
            organization_config: Dict with organization settings, or None to load from config
        """
        if organization_config:
            self.config = organization_config
        else:
            self.config = self._load_default_config()

        self.agents = self.config.get('agents', {})
        self.keywords = self.config.get('keywords', {})
        self.organization_name = self.config.get('organization_name', 'Organization')
        self.organization_type = self.config.get('organization_type', 'general')

    def _load_default_config(self):
        """Load default organization configuration"""
        # Try to load from config file first
        config_path = os.path.join('app', 'ai', 'organization_config.json')
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                return json.load(f)

        # Default generic configuration
        return {
            'organization_name': 'AI Assistant',
            'organization_type': 'general',
            'agents': {
                'general': {
                    'name': 'General Assistant',
                    'title': 'AI Assistant',
                    'department': 'General Support',
                    'keywords': ['help', 'general', 'info', 'question'],
                    'availability': '24/7',
                    'greeting': 'Hello! How can I assist you today?'
                }
            },
            'keywords': {
                'general': ['general']
            }
        }

    def analyze_request(self, message):
        """
        Analyze user message to route to appropriate agent
        Now with AI-powered custom organization detection

        Args:
            message: User's description of their issue/request

        Returns:
            dict: Analysis results with detected keywords and agent recommendation
        """
        message_lower = message.lower()
        detected_keywords = []
        potential_agents = set()

        # First, check if user is mentioning a custom organization
        custom_org = self._detect_custom_organization(message_lower)

        if custom_org:
            # User is calling a custom organization, create dynamic agent
            agent = self._create_dynamic_agent(custom_org, message_lower)
            return {
                'detected_keywords': ['custom organization'],
                'agent_key': 'custom',
                'agent': agent,
                'confidence': 0.8,
                'routing_reason': f"Connecting you to {custom_org['name']}",
                'is_custom': True,
                'organization': custom_org
            }

        # Check for keyword matches in predefined agents
        for keyword, agent_keys in self.keywords.items():
            if keyword in message_lower:
                detected_keywords.append(keyword)
                potential_agents.update(agent_keys)

        # If no specific keywords, route to general
        if not potential_agents:
            # Find first agent marked as 'general' or default
            for agent_key, agent_info in self.agents.items():
                if agent_info.get('is_default', False) or agent_key == 'general':
                    potential_agents.add(agent_key)
                    break

            # If still no match, use first available agent
            if not potential_agents and self.agents:
                potential_agents.add(list(self.agents.keys())[0])

            detected_keywords.append('general inquiry')

        # Prioritize emergency if detected
        if 'emergency' in potential_agents:
            agent_key = 'emergency'
        else:
            # Get the first agent from the set
            agent_key = list(potential_agents)[0] if potential_agents else 'general'

        agent = self.agents.get(agent_key, self.agents.get('general'))

        return {
            'detected_keywords': detected_keywords,
            'agent_key': agent_key,
            'agent': agent,
            'confidence': self._calculate_confidence(detected_keywords),
            'routing_reason': self._get_routing_reason(detected_keywords, agent),
            'is_custom': False
        }

    def _calculate_confidence(self, keywords):
        """Calculate confidence score for routing decision"""
        if not keywords:
            return 0.5
        if len(keywords) >= 2:
            return 0.9
        return 0.7

    def _get_routing_reason(self, keywords, agent):
        """Generate human-readable routing reason"""
        if not keywords or keywords == ['general inquiry']:
            return f"Connecting you to {agent['name']}"

        keyword_list = ', '.join(keywords)
        return f"Based on your inquiry ({keyword_list}), connecting you to {agent['name']}"

    def get_agent_greeting(self, agent):
        """Get personalized greeting from agent"""
        if 'greeting' in agent:
            return agent['greeting']
        return f"Hello, I'm {agent['name']} from {agent['department']}. How can I help you today?"

    def list_all_agents(self):
        """Return list of all available agents"""
        return [
            {
                'key': key,
                'name': agent['name'],
                'title': agent['title'],
                'department': agent['department'],
                'availability': agent.get('availability', 'Business Hours')
            }
            for key, agent in self.agents.items()
        ]

    def get_organization_info(self):
        """Return organization information"""
        return {
            'name': self.organization_name,
            'type': self.organization_type,
            'agent_count': len(self.agents)
        }

    def _detect_custom_organization(self, message_lower):
        """
        Detect if user is mentioning a custom organization (university, hospital, company, etc.)

        Returns:
            dict or None: Organization info if detected, None otherwise
        """
        # Well-known organization abbreviations
        known_universities = {
            'mit': 'MIT',
            'ucla': 'UCLA',
            'nyu': 'NYU',
            'usc': 'USC',
            'ucsd': 'UCSD',
            'ucb': 'UC Berkeley',
            'stanford': 'Stanford',
            'harvard': 'Harvard',
            'yale': 'Yale',
            'princeton': 'Princeton',
            'columbia': 'Columbia',
            'cornell': 'Cornell',
            'duke': 'Duke',
            'upenn': 'UPenn',
        }

        # Check for known universities first
        for abbrev, full_name in known_universities.items():
            if re.search(r'\b' + abbrev + r'\b', message_lower):
                return {
                    'name': full_name,
                    'type': 'university',
                    'is_custom': True
                }

        # Organization type indicators
        org_indicators = {
            'university': ['university', 'college', 'institute of technology', 'polytechnic'],
            'hospital': ['hospital', 'medical center', 'clinic', 'health center', 'healthcare'],
            'school': ['school', 'academy', 'high school', 'elementary'],
            'company': ['company', 'corporation', 'inc', 'ltd', 'llc'],
            'restaurant': ['restaurant', 'cafe', 'bistro', 'diner'],
            'hotel': ['hotel', 'resort', 'inn', 'motel'],
            'bank': ['bank', 'credit union', 'financial'],
            'store': ['store', 'shop', 'mart', 'market'],
            'government': ['city hall', 'town hall', 'department of', 'dmv', 'government'],
            'law': ['law firm', 'attorney', 'legal'],
        }

        # Look for organization type
        detected_type = None
        for org_type, indicators in org_indicators.items():
            for indicator in indicators:
                if indicator in message_lower:
                    detected_type = org_type
                    break
            if detected_type:
                break

        if not detected_type:
            return None

        # Try to extract organization name
        org_name = self._extract_organization_name(message_lower, detected_type, org_indicators[detected_type])

        if org_name:
            return {
                'name': org_name,
                'type': detected_type,
                'is_custom': True
            }

        return None

    def _extract_organization_name(self, message_lower, org_type, indicators):
        """Extract organization name from message"""
        # Common organization name patterns
        import re

        # Try to find the organization name before the type indicator
        for indicator in indicators:
            # Pattern: "call [Name] [Indicator]" or "calling [Name] [Indicator]"
            # Now works with lowercase input by using word boundaries
            pattern = r'(?:call|calling|contact|reach)\s+([a-zA-Z\s&]+?)\s+' + re.escape(indicator)
            match = re.search(pattern, message_lower, re.IGNORECASE)
            if match:
                name = match.group(1).strip()
                # Filter out common words
                common_words = ['the', 'a', 'an', 'to', 'for', 'i', 'want', 'need', 'my']
                if name.lower() not in common_words and len(name) > 1:
                    return name.title()

            # Pattern: "[Name] [Indicator]" - catches things like "MIT for billing"
            pattern = r'\b([a-zA-Z\s&\.]+?)\s+(?:for\s+)?' + re.escape(indicator)
            match = re.search(pattern, message_lower, re.IGNORECASE)
            if match:
                name = match.group(1).strip()
                # Filter out common words and action verbs
                common_words = ['the', 'a', 'an', 'to', 'for', 'i', 'want', 'need', 'my', 'call', 'calling', 'contact', 'reach']
                if name.lower() not in common_words and len(name) > 1:
                    return name.upper() if len(name) <= 4 and name.isalpha() else name.title()

        # If no name found, return generic name based on type
        return f"{org_type.title()}"

    def _create_dynamic_agent(self, org_info, message_lower):
        """
        Create a dynamic agent for custom organization

        Args:
            org_info: Dict with organization info (name, type)
            message_lower: Original message in lowercase

        Returns:
            dict: Agent configuration
        """
        org_name = org_info['name']
        org_type = org_info['type']

        # Detect department/inquiry type from message
        department = self._detect_department(message_lower, org_type)

        agent = {
            'name': f"{org_name} {department['title']}",
            'title': department['title'],
            'department': department['name'],
            'availability': '24/7',
            'greeting': f"Hello! You've reached {org_name}. I'm connecting you to {department['name']}. How can we assist you today?",
            'organization': org_name,
            'is_custom': True
        }

        return agent

    def _detect_department(self, message_lower, org_type):
        """Detect which department user wants to reach"""
        # Department keywords
        dept_keywords = {
            'admissions': ['admission', 'enroll', 'apply', 'application'],
            'billing': ['billing', 'payment', 'invoice', 'cost', 'fee', 'tuition'],
            'support': ['support', 'help', 'issue', 'problem', 'technical'],
            'emergency': ['emergency', 'urgent', 'critical', 'immediate'],
            'information': ['information', 'info', 'question', 'inquiry'],
            'appointment': ['appointment', 'schedule', 'book', 'reservation'],
            'reception': ['reception', 'front desk', 'general'],
        }

        for dept, keywords in dept_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                return {
                    'name': f"{dept.title()} Department",
                    'title': f"{dept.title()} Specialist"
                }

        # Default to reception for the organization type
        return {
            'name': 'Reception',
            'title': 'Receptionist'
        }

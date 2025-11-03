"""
Pre-configured organization templates
Easy-to-use configurations for different types of organizations
"""

HOSPITAL_CONFIG = {
    'organization_name': 'City General Hospital',
    'organization_type': 'healthcare',
    'agents': {
        'emergency': {
            'name': 'Emergency Department',
            'title': 'Emergency Medicine',
            'department': 'Emergency Room',
            'keywords': ['emergency', 'urgent', 'severe', 'critical', '911', 'accident'],
            'availability': '24/7',
            'greeting': 'Emergency Department. What is your emergency?',
            'is_priority': True
        },
        'cardiology': {
            'name': 'Dr. Sarah Johnson',
            'title': 'Cardiologist',
            'department': 'Cardiology',
            'keywords': ['heart', 'chest pain', 'heart attack', 'cardiovascular'],
            'availability': '24/7',
            'greeting': 'Hello, I\'m Dr. Sarah Johnson, Cardiologist. How can I help you today?'
        },
        'general': {
            'name': 'Dr. Amanda Taylor',
            'title': 'General Practitioner',
            'department': 'General Medicine',
            'keywords': ['general', 'checkup', 'consultation'],
            'availability': '24/7',
            'greeting': 'Hello, I\'m Dr. Amanda Taylor, General Practitioner. How can I assist you?',
            'is_default': True
        }
    },
    'keywords': {
        'emergency': ['emergency', 'urgent'],
        'chest pain': ['cardiology'],
        'heart': ['cardiology'],
        'general': ['general']
    }
}

SCHOOL_CONFIG = {
    'organization_name': 'Sunrise High School',
    'organization_type': 'education',
    'agents': {
        'admissions': {
            'name': 'Sarah Mitchell',
            'title': 'Admissions Officer',
            'department': 'Admissions Office',
            'keywords': ['admission', 'enroll', 'registration', 'new student', 'apply'],
            'availability': '8 AM - 4 PM',
            'greeting': 'Hello! This is Sarah Mitchell from Admissions. How can I help you with enrollment?'
        },
        'academics': {
            'name': 'Dr. James Wilson',
            'title': 'Academic Coordinator',
            'department': 'Academic Affairs',
            'keywords': ['grades', 'courses', 'curriculum', 'classes', 'schedule', 'transcript'],
            'availability': '8 AM - 5 PM',
            'greeting': 'Hello, I\'m Dr. James Wilson, Academic Coordinator. How can I assist you?'
        },
        'counselor': {
            'name': 'Lisa Anderson',
            'title': 'School Counselor',
            'department': 'Student Services',
            'keywords': ['counseling', 'guidance', 'college', 'career', 'personal'],
            'availability': '9 AM - 4 PM',
            'greeting': 'Hi! I\'m Lisa Anderson, School Counselor. I\'m here to help you.'
        },
        'general': {
            'name': 'Front Office',
            'title': 'Receptionist',
            'department': 'Main Office',
            'keywords': ['general', 'information', 'help'],
            'availability': '7 AM - 5 PM',
            'greeting': 'Hello! Welcome to Sunrise High School. How can I direct your call?',
            'is_default': True
        }
    },
    'keywords': {
        'admission': ['admissions'],
        'enroll': ['admissions'],
        'grades': ['academics'],
        'course': ['academics'],
        'counseling': ['counselor'],
        'general': ['general']
    }
}

SOFTWARE_COMPANY_CONFIG = {
    'organization_name': 'TechVision Solutions',
    'organization_type': 'technology',
    'agents': {
        'sales': {
            'name': 'Michael Chen',
            'title': 'Sales Representative',
            'department': 'Sales Department',
            'keywords': ['buy', 'purchase', 'pricing', 'demo', 'quote', 'product'],
            'availability': '9 AM - 6 PM',
            'greeting': 'Hello! I\'m Michael Chen from Sales. How can I help you find the right solution?'
        },
        'support': {
            'name': 'Emily Rodriguez',
            'title': 'Technical Support Engineer',
            'department': 'Technical Support',
            'keywords': ['bug', 'error', 'issue', 'problem', 'not working', 'help', 'support'],
            'availability': '24/7',
            'greeting': 'Hi! I\'m Emily from Technical Support. What issue are you experiencing?'
        },
        'billing': {
            'name': 'David Park',
            'title': 'Billing Specialist',
            'department': 'Billing & Accounts',
            'keywords': ['bill', 'invoice', 'payment', 'subscription', 'refund', 'account'],
            'availability': '9 AM - 5 PM',
            'greeting': 'Hello! I\'m David from Billing. How can I assist you with your account?'
        },
        'general': {
            'name': 'AI Assistant',
            'title': 'Virtual Receptionist',
            'department': 'General Inquiries',
            'keywords': ['general', 'information'],
            'availability': '24/7',
            'greeting': 'Hello! Welcome to TechVision Solutions. How can I assist you today?',
            'is_default': True
        }
    },
    'keywords': {
        'sales': ['sales'],
        'buy': ['sales'],
        'support': ['support'],
        'bug': ['support'],
        'billing': ['billing'],
        'payment': ['billing'],
        'general': ['general']
    }
}

JAIL_CONFIG = {
    'organization_name': 'County Correctional Facility',
    'organization_type': 'corrections',
    'agents': {
        'visitation': {
            'name': 'Visitation Coordinator',
            'title': 'Visitation Officer',
            'department': 'Visitation Services',
            'keywords': ['visit', 'visiting', 'visitation', 'see inmate', 'appointment'],
            'availability': '8 AM - 4 PM',
            'greeting': 'Visitation Services. How can I assist you with scheduling a visit?'
        },
        'inmate_info': {
            'name': 'Records Department',
            'title': 'Records Officer',
            'department': 'Inmate Records',
            'keywords': ['inmate', 'prisoner', 'locate', 'information', 'status', 'release'],
            'availability': '8 AM - 5 PM',
            'greeting': 'Inmate Records. How can I help you locate information?'
        },
        'property': {
            'name': 'Property Officer',
            'title': 'Property Management',
            'department': 'Inmate Property',
            'keywords': ['property', 'belongings', 'items', 'possessions'],
            'availability': '9 AM - 4 PM',
            'greeting': 'Property Management. How can I assist you with inmate property?'
        },
        'general': {
            'name': 'Reception',
            'title': 'Front Desk',
            'department': 'Main Office',
            'keywords': ['general', 'information'],
            'availability': '24/7',
            'greeting': 'County Correctional Facility. How may I direct your call?',
            'is_default': True
        }
    },
    'keywords': {
        'visit': ['visitation'],
        'inmate': ['inmate_info'],
        'property': ['property'],
        'general': ['general']
    }
}

LAW_FIRM_CONFIG = {
    'organization_name': 'Smith & Associates Law Firm',
    'organization_type': 'legal',
    'agents': {
        'criminal': {
            'name': 'Attorney John Smith',
            'title': 'Criminal Defense Attorney',
            'department': 'Criminal Law',
            'keywords': ['criminal', 'arrest', 'charges', 'defense', 'court'],
            'availability': '24/7',
            'greeting': 'Hello, this is Attorney John Smith. How can I help with your legal matter?'
        },
        'family': {
            'name': 'Attorney Maria Garcia',
            'title': 'Family Law Attorney',
            'department': 'Family Law',
            'keywords': ['divorce', 'custody', 'family', 'child support', 'marriage'],
            'availability': '9 AM - 5 PM',
            'greeting': 'Hello, this is Attorney Maria Garcia, Family Law specialist. How can I assist you?'
        },
        'consultation': {
            'name': 'Legal Intake',
            'title': 'Case Manager',
            'department': 'New Client Services',
            'keywords': ['consultation', 'new case', 'lawyer', 'attorney'],
            'availability': '9 AM - 6 PM',
            'greeting': 'Hello, I can help you schedule a consultation with an attorney. What type of case do you have?'
        },
        'general': {
            'name': 'Reception',
            'title': 'Legal Assistant',
            'department': 'Front Office',
            'keywords': ['general', 'information'],
            'availability': '9 AM - 5 PM',
            'greeting': 'Smith & Associates Law Firm. How may I direct your call?',
            'is_default': True
        }
    },
    'keywords': {
        'criminal': ['criminal'],
        'family': ['family'],
        'divorce': ['family'],
        'consultation': ['consultation'],
        'general': ['general']
    }
}

RESTAURANT_CONFIG = {
    'organization_name': 'The Golden Fork Restaurant',
    'organization_type': 'hospitality',
    'agents': {
        'reservations': {
            'name': 'Reservation Desk',
            'title': 'Host',
            'department': 'Reservations',
            'keywords': ['reservation', 'booking', 'table', 'party', 'dine'],
            'availability': '11 AM - 10 PM',
            'greeting': 'Hello! Thank you for calling The Golden Fork. Would you like to make a reservation?'
        },
        'takeout': {
            'name': 'Takeout Counter',
            'title': 'Takeout Specialist',
            'department': 'Takeout & Delivery',
            'keywords': ['takeout', 'order', 'delivery', 'pickup', 'to-go'],
            'availability': '11 AM - 10 PM',
            'greeting': 'Hello! Ready to place a takeout order?'
        },
        'catering': {
            'name': 'Sarah Johnson',
            'title': 'Catering Manager',
            'department': 'Catering Services',
            'keywords': ['catering', 'event', 'large order', 'party catering'],
            'availability': '10 AM - 6 PM',
            'greeting': 'Hello! I\'m Sarah, our Catering Manager. How can I help plan your event?'
        },
        'general': {
            'name': 'Front Desk',
            'title': 'Receptionist',
            'department': 'General Inquiries',
            'keywords': ['general', 'hours', 'location', 'menu'],
            'availability': '11 AM - 10 PM',
            'greeting': 'Thank you for calling The Golden Fork. How may I help you?',
            'is_default': True
        }
    },
    'keywords': {
        'reservation': ['reservations'],
        'takeout': ['takeout'],
        'delivery': ['takeout'],
        'catering': ['catering'],
        'general': ['general']
    }
}

# Registry of all available configurations
ORGANIZATION_CONFIGS = {
    'hospital': HOSPITAL_CONFIG,
    'school': SCHOOL_CONFIG,
    'software': SOFTWARE_COMPANY_CONFIG,
    'jail': JAIL_CONFIG,
    'law_firm': LAW_FIRM_CONFIG,
    'restaurant': RESTAURANT_CONFIG
}


def get_organization_config(org_type='general'):
    """
    Get organization configuration by type

    Args:
        org_type: Type of organization (hospital, school, software, etc.)

    Returns:
        dict: Organization configuration
    """
    return ORGANIZATION_CONFIGS.get(org_type, SOFTWARE_COMPANY_CONFIG)


def list_available_configs():
    """List all available organization configurations"""
    return list(ORGANIZATION_CONFIGS.keys())

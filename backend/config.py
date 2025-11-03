import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'

    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')

    # AI Model Configuration
    AI_MODEL_NAME = os.getenv('AI_MODEL_NAME', 'microsoft/DialoGPT-medium')
    AI_MODEL_TYPE = os.getenv('AI_MODEL_TYPE', 'huggingface')  # huggingface, openai

    # HuggingFace
    HUGGINGFACE_TOKEN = os.getenv('HUGGINGFACE_TOKEN', None)
    MAX_LENGTH = int(os.getenv('MAX_LENGTH', '100'))
    TEMPERATURE = float(os.getenv('TEMPERATURE', '0.7'))
    TOP_P = float(os.getenv('TOP_P', '0.9'))

    # OpenAI (optional)
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', None)
    OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')

    # Conversation
    MAX_CONVERSATION_HISTORY = int(os.getenv('MAX_CONVERSATION_HISTORY', '10'))

    # Storage
    STORAGE_TYPE = os.getenv('STORAGE_TYPE', 'local')  # local, supabase

    # Supabase (optional)
    SUPABASE_URL = os.getenv('SUPABASE_URL', None)
    SUPABASE_KEY = os.getenv('SUPABASE_KEY', None)

    # Plugins
    PLUGINS_ENABLED = os.getenv('PLUGINS_ENABLED', 'True') == 'True'

    # Organization Configuration
    ORGANIZATION_TYPE = os.getenv('ORGANIZATION_TYPE', 'software')  # hospital, school, software, jail, law_firm, restaurant
    ORGANIZATION_NAME = os.getenv('ORGANIZATION_NAME', None)  # Custom organization name

    @staticmethod
    def validate():
        """Validate required configuration"""
        errors = []

        if Config.AI_MODEL_TYPE == 'openai' and not Config.OPENAI_API_KEY:
            errors.append("OPENAI_API_KEY is required when using OpenAI model")

        if Config.STORAGE_TYPE == 'supabase':
            if not Config.SUPABASE_URL:
                errors.append("SUPABASE_URL is required when using Supabase storage")
            if not Config.SUPABASE_KEY:
                errors.append("SUPABASE_KEY is required when using Supabase storage")

        return errors

"""
Translator Plugin
Translates text between languages
"""

from app.plugins.base import BasePlugin


class TranslatorPlugin(BasePlugin):
    """Plugin for translating text"""

    def __init__(self):
        super().__init__()
        self.language_codes = {
            'spanish': 'es',
            'french': 'fr',
            'german': 'de',
            'italian': 'it',
            'portuguese': 'pt',
            'russian': 'ru',
            'chinese': 'zh',
            'japanese': 'ja',
            'korean': 'ko',
            'arabic': 'ar'
        }

    def get_description(self):
        return "Translates text between different languages"

    def execute(self, context):
        """
        Execute translation

        Context keys:
            - text: Text to translate
            - target_language: Target language code or name
            - source_language: Source language (optional, auto-detect)

        Returns:
            dict: Translation details
        """
        # Validate required fields
        is_valid, error = self.validate_context(context, ['text', 'target_language'])
        if not is_valid:
            raise ValueError(error)

        text = context['text']
        target_lang = context['target_language'].lower()
        source_lang = context.get('source_language', 'auto')

        # Convert language name to code if needed
        target_lang_code = self.language_codes.get(target_lang, target_lang)

        # Perform translation
        translated_text = self._translate(text, target_lang_code, source_lang)

        return {
            'original_text': text,
            'translated_text': translated_text,
            'source_language': source_lang,
            'target_language': target_lang_code,
            'message': f'Translated to {target_lang}'
        }

    def _translate(self, text, target_lang, source_lang):
        """
        Perform translation
        This is a placeholder - in production, integrate with a translation API
        like Google Translate, DeepL, or a local model
        """
        # Placeholder implementation
        # In production, use proper translation API or model

        translations = {
            'es': {
                'hello': 'hola',
                'goodbye': 'adiós',
                'thank you': 'gracias',
                'please': 'por favor'
            },
            'fr': {
                'hello': 'bonjour',
                'goodbye': 'au revoir',
                'thank you': 'merci',
                'please': 's\'il vous plaît'
            },
            'de': {
                'hello': 'hallo',
                'goodbye': 'auf wiedersehen',
                'thank you': 'danke',
                'please': 'bitte'
            }
        }

        text_lower = text.lower()

        if target_lang in translations and text_lower in translations[target_lang]:
            return translations[target_lang][text_lower]

        # Fallback message
        return f"[Translation to {target_lang}]: {text} (Translation service not configured. Please integrate a translation API like Google Translate or DeepL)"

    def get_supported_languages(self):
        """Get list of supported languages"""
        return list(self.language_codes.keys())

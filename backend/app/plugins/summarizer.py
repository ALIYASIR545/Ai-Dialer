"""
Summarizer Plugin
Summarizes conversation or text
"""

from app.plugins.base import BasePlugin


class SummarizerPlugin(BasePlugin):
    """Plugin for summarizing text and conversations"""

    def get_description(self):
        return "Summarizes conversations and long text passages"

    def execute(self, context):
        """
        Execute summarization

        Context keys:
            - text: Text to summarize (optional)
            - conversation: Conversation history to summarize (optional)
            - max_length: Maximum summary length in words

        Returns:
            dict: Summary details
        """
        text = context.get('text')
        conversation = context.get('conversation')

        if not text and not conversation:
            raise ValueError("Either 'text' or 'conversation' must be provided")

        max_length = context.get('max_length', 100)

        # Prepare text for summarization
        if conversation:
            text = self._conversation_to_text(conversation)

        # Perform summarization
        summary = self._summarize(text, max_length)

        return {
            'summary': summary,
            'original_length': len(text.split()),
            'summary_length': len(summary.split()),
            'compression_ratio': f"{len(summary.split()) / len(text.split()) * 100:.1f}%"
        }

    def _conversation_to_text(self, conversation):
        """Convert conversation history to text"""
        text_parts = []

        for msg in conversation:
            role = "User" if msg['role'] == 'user' else "Assistant"
            text_parts.append(f"{role}: {msg['content']}")

        return "\n".join(text_parts)

    def _summarize(self, text, max_length):
        """
        Perform summarization
        This is a simple extractive summarization
        In production, use a proper NLP model
        """
        sentences = text.split('. ')

        # Simple extractive summarization: take first N sentences
        word_count = 0
        summary_sentences = []

        for sentence in sentences:
            sentence_words = len(sentence.split())
            if word_count + sentence_words > max_length:
                break
            summary_sentences.append(sentence)
            word_count += sentence_words

        summary = '. '.join(summary_sentences)

        if not summary.endswith('.'):
            summary += '.'

        return summary

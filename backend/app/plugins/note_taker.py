"""
Note Taker Plugin
Takes and stores notes from conversation
"""

from app.plugins.base import BasePlugin
from datetime import datetime


class NoteTakerPlugin(BasePlugin):
    """Plugin for taking notes during conversation"""

    def __init__(self):
        super().__init__()
        self.notes = []  # In production, use database

    def get_description(self):
        return "Takes and stores notes from the conversation"

    def execute(self, context):
        """
        Execute note taking

        Context keys:
            - content: Note content
            - user_id: Optional user identifier
            - tags: Optional list of tags

        Returns:
            dict: Note details
        """
        # Validate required fields
        is_valid, error = self.validate_context(context, ['content'])
        if not is_valid:
            raise ValueError(error)

        note = {
            'id': len(self.notes) + 1,
            'content': context['content'],
            'timestamp': datetime.now().isoformat(),
            'user_id': context.get('user_id', 'default'),
            'tags': context.get('tags', [])
        }

        self.notes.append(note)

        return {
            'note': note,
            'message': 'Note saved successfully',
            'total_notes': len(self.notes)
        }

    def get_notes(self, user_id='default'):
        """Get all notes for a user"""
        return [note for note in self.notes if note['user_id'] == user_id]

    def delete_note(self, note_id):
        """Delete a note by ID"""
        self.notes = [note for note in self.notes if note['id'] != note_id]
        return {'success': True, 'message': f'Note {note_id} deleted'}

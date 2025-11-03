"""
Transcript API Routes
Handles transcript saving and exporting
"""

from flask import Blueprint, request, jsonify, send_file
from io import BytesIO
from app.ai.conversation_manager import ConversationManager

transcript_bp = Blueprint('transcript', __name__)
conversation_manager = ConversationManager()


@transcript_bp.route('/save', methods=['POST'])
def save_transcript():
    """Save conversation transcript"""
    try:
        data = request.get_json()
        conversation = data.get('conversation', [])

        if not conversation:
            return jsonify({'error': 'No conversation to save'}), 400

        # Get conversation stats
        stats = conversation_manager.get_conversation_stats(conversation)

        # In production, save to database
        # For now, just return success with stats

        return jsonify({
            'success': True,
            'message': 'Transcript saved successfully',
            'stats': stats
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@transcript_bp.route('/export', methods=['POST'])
def export_transcript():
    """Export conversation transcript in various formats"""
    try:
        data = request.get_json()
        conversation = data.get('conversation', [])
        format_type = data.get('format', 'txt')

        if not conversation:
            return jsonify({'error': 'No conversation to export'}), 400

        # Format conversation
        formatted_content = conversation_manager.format_conversation_for_export(
            conversation,
            format_type
        )

        # Create file-like object
        file_obj = BytesIO(formatted_content.encode('utf-8'))
        file_obj.seek(0)

        # Determine MIME type
        mime_types = {
            'txt': 'text/plain',
            'json': 'application/json',
            'md': 'text/markdown',
            'markdown': 'text/markdown'
        }
        mime_type = mime_types.get(format_type, 'text/plain')

        return send_file(
            file_obj,
            mimetype=mime_type,
            as_attachment=True,
            download_name=f'transcript.{format_type}'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@transcript_bp.route('/stats', methods=['POST'])
def get_transcript_stats():
    """Get statistics about a conversation"""
    try:
        data = request.get_json()
        conversation = data.get('conversation', [])

        stats = conversation_manager.get_conversation_stats(conversation)

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

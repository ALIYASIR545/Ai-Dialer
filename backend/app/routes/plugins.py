"""
Plugins API Routes
Handles plugin management and invocation
"""

from flask import Blueprint, request, jsonify
from app.plugins.registry import get_registry

plugins_bp = Blueprint('plugins', __name__)


@plugins_bp.route('/', methods=['GET'])
def list_plugins():
    """List all available plugins"""
    try:
        registry = get_registry()
        plugins = registry.list_plugins()

        return jsonify({
            'plugins': plugins,
            'count': len(plugins)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@plugins_bp.route('/invoke', methods=['POST'])
def invoke_plugin():
    """
    Invoke a plugin

    Request body:
        plugin: Plugin name
        context: Plugin execution context
    """
    try:
        data = request.get_json()

        if not data or 'plugin' not in data:
            return jsonify({'error': 'Plugin name is required'}), 400

        plugin_name = data['plugin']
        context = data.get('context', {})

        registry = get_registry()
        result = registry.invoke_plugin(plugin_name, context)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@plugins_bp.route('/<plugin_name>', methods=['GET'])
def get_plugin_info(plugin_name):
    """Get information about a specific plugin"""
    try:
        registry = get_registry()
        plugin = registry.get_plugin(plugin_name)

        if not plugin:
            return jsonify({'error': f"Plugin '{plugin_name}' not found"}), 404

        return jsonify(plugin.get_metadata()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

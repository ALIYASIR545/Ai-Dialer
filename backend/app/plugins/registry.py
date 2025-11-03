"""
Plugin Registry
Discovers and manages plugins
"""

import os
import importlib
import inspect
from app.plugins.base import BasePlugin


class PluginRegistry:
    """Manages plugin registration and discovery"""

    def __init__(self):
        self.plugins = {}
        self.discover_plugins()

    def discover_plugins(self):
        """Automatically discover and register plugins"""
        plugins_dir = os.path.dirname(__file__)

        # Get all Python files in plugins directory
        for filename in os.listdir(plugins_dir):
            if filename.endswith('.py') and not filename.startswith('__') and filename not in ['base.py', 'registry.py']:
                module_name = filename[:-3]  # Remove .py extension

                try:
                    # Import module
                    module = importlib.import_module(f'app.plugins.{module_name}')

                    # Find plugin classes
                    for name, obj in inspect.getmembers(module, inspect.isclass):
                        if issubclass(obj, BasePlugin) and obj != BasePlugin:
                            # Instantiate and register
                            plugin_instance = obj()
                            self.register_plugin(plugin_instance)
                            print(f"Registered plugin: {name}")

                except Exception as e:
                    print(f"Failed to load plugin {module_name}: {e}")

    def register_plugin(self, plugin):
        """
        Register a plugin

        Args:
            plugin: Plugin instance (must inherit from BasePlugin)
        """
        if not isinstance(plugin, BasePlugin):
            raise ValueError("Plugin must inherit from BasePlugin")

        self.plugins[plugin.name] = plugin

    def get_plugin(self, name):
        """
        Get plugin by name

        Args:
            name: Plugin name

        Returns:
            BasePlugin instance or None
        """
        return self.plugins.get(name)

    def list_plugins(self):
        """
        List all registered plugins

        Returns:
            list: List of plugin metadata
        """
        return [plugin.get_metadata() for plugin in self.plugins.values()]

    def invoke_plugin(self, name, context):
        """
        Invoke a plugin by name

        Args:
            name: Plugin name
            context: Execution context

        Returns:
            dict: Plugin execution result
        """
        plugin = self.get_plugin(name)

        if not plugin:
            return {
                'success': False,
                'error': f"Plugin '{name}' not found"
            }

        if not plugin.enabled:
            return {
                'success': False,
                'error': f"Plugin '{name}' is disabled"
            }

        try:
            result = plugin.execute(context)
            return {
                'success': True,
                'plugin': name,
                'result': result
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


# Global plugin registry instance
_registry = None


def get_registry():
    """Get or create global plugin registry"""
    global _registry
    if _registry is None:
        _registry = PluginRegistry()
    return _registry

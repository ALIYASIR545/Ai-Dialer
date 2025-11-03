"""
Base Plugin Class
All plugins must inherit from this class
"""

from abc import ABC, abstractmethod


class BasePlugin(ABC):
    """Base class for all plugins"""

    def __init__(self):
        self.name = self.__class__.__name__
        self.enabled = True

    @abstractmethod
    def execute(self, context):
        """
        Execute the plugin with given context

        Args:
            context: Dictionary containing plugin execution context

        Returns:
            dict: Plugin execution result
        """
        pass

    @abstractmethod
    def get_description(self):
        """
        Get plugin description

        Returns:
            str: Plugin description
        """
        pass

    def validate_context(self, context, required_keys):
        """
        Validate that context has required keys

        Args:
            context: Context dictionary
            required_keys: List of required keys

        Returns:
            tuple: (is_valid, error_message)
        """
        missing_keys = [key for key in required_keys if key not in context]

        if missing_keys:
            return False, f"Missing required keys: {', '.join(missing_keys)}"

        return True, None

    def get_metadata(self):
        """Get plugin metadata"""
        return {
            'name': self.name,
            'description': self.get_description(),
            'enabled': self.enabled
        }

# Plugin Development Guide

Learn how to create custom plugins for AI Dialer.

## Overview

Plugins extend AI Dialer's functionality by adding new capabilities that can be invoked during conversations. The plugin system is designed to be:

- **Simple**: Easy to create and understand
- **Modular**: Each plugin is self-contained
- **Discoverable**: Plugins are automatically registered
- **Flexible**: Support any kind of functionality

## Plugin Architecture

```
app/plugins/
├── base.py              # Base plugin class
├── registry.py          # Plugin discovery and management
├── note_taker.py        # Example plugin
├── summarizer.py        # Example plugin
├── translator.py        # Example plugin
└── your_plugin.py       # Your custom plugin
```

## Creating a Plugin

### Step 1: Create Plugin File

Create a new file in `backend/app/plugins/`:

```python
# app/plugins/my_plugin.py

from app.plugins.base import BasePlugin

class MyPlugin(BasePlugin):
    """Brief description of what your plugin does"""

    def __init__(self):
        super().__init__()
        # Initialize any resources here

    def get_description(self):
        """Return a description of the plugin"""
        return "Describe what your plugin does"

    def execute(self, context):
        """
        Main plugin logic

        Args:
            context: Dictionary with plugin parameters

        Returns:
            dict: Plugin execution result
        """
        # Validate required parameters
        is_valid, error = self.validate_context(context, ['required_param'])
        if not is_valid:
            raise ValueError(error)

        # Your plugin logic here
        result = self._do_something(context)

        return {
            'result': result,
            'message': 'Plugin executed successfully'
        }

    def _do_something(self, context):
        """Private helper method"""
        # Implementation details
        pass
```

### Step 2: Test Your Plugin

The plugin will be automatically discovered when the backend starts.

Test via API:

```bash
curl -X POST http://localhost:5000/api/plugins/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "plugin": "MyPlugin",
    "context": {
      "required_param": "value"
    }
  }'
```

## Plugin Examples

### Example 1: Weather Plugin

Get weather information:

```python
from app.plugins.base import BasePlugin
import requests

class WeatherPlugin(BasePlugin):
    """Fetches weather information"""

    def __init__(self):
        super().__init__()
        self.api_key = "your-weather-api-key"

    def get_description(self):
        return "Fetches current weather for a location"

    def execute(self, context):
        is_valid, error = self.validate_context(context, ['location'])
        if not is_valid:
            raise ValueError(error)

        location = context['location']
        weather = self._fetch_weather(location)

        return {
            'location': location,
            'temperature': weather['temp'],
            'condition': weather['condition'],
            'message': f"Weather in {location}: {weather['temp']}°F, {weather['condition']}"
        }

    def _fetch_weather(self, location):
        # Call weather API
        url = f"https://api.weather.com/v1/current?location={location}&key={self.api_key}"
        response = requests.get(url)
        data = response.json()

        return {
            'temp': data['temperature'],
            'condition': data['weather']
        }
```

### Example 2: Calendar Plugin

Schedule meetings:

```python
from app.plugins.base import BasePlugin
from datetime import datetime

class CalendarPlugin(BasePlugin):
    """Manages calendar events"""

    def __init__(self):
        super().__init__()
        self.events = []

    def get_description(self):
        return "Schedules and manages calendar events"

    def execute(self, context):
        action = context.get('action', 'add')

        if action == 'add':
            return self._add_event(context)
        elif action == 'list':
            return self._list_events()
        elif action == 'delete':
            return self._delete_event(context)

    def _add_event(self, context):
        is_valid, error = self.validate_context(
            context,
            ['title', 'date', 'time']
        )
        if not is_valid:
            raise ValueError(error)

        event = {
            'id': len(self.events) + 1,
            'title': context['title'],
            'date': context['date'],
            'time': context['time'],
            'created': datetime.now().isoformat()
        }

        self.events.append(event)

        return {
            'event': event,
            'message': f"Event '{event['title']}' scheduled for {event['date']} at {event['time']}"
        }

    def _list_events(self):
        return {
            'events': self.events,
            'count': len(self.events)
        }

    def _delete_event(self, context):
        event_id = context.get('event_id')
        self.events = [e for e in self.events if e['id'] != event_id]

        return {
            'message': f"Event {event_id} deleted",
            'remaining': len(self.events)
        }
```

### Example 3: Code Executor Plugin

Execute code safely:

```python
from app.plugins.base import BasePlugin
import sys
from io import StringIO

class CodeExecutorPlugin(BasePlugin):
    """Safely executes Python code snippets"""

    def get_description(self):
        return "Executes Python code in a sandboxed environment"

    def execute(self, context):
        is_valid, error = self.validate_context(context, ['code'])
        if not is_valid:
            raise ValueError(error)

        code = context['code']
        result = self._execute_code(code)

        return {
            'code': code,
            'output': result['output'],
            'error': result['error'],
            'success': result['success']
        }

    def _execute_code(self, code):
        # Capture stdout
        old_stdout = sys.stdout
        sys.stdout = captured_output = StringIO()

        result = {
            'output': '',
            'error': None,
            'success': True
        }

        try:
            # Execute code
            exec(code, {'__builtins__': __builtins__})
            result['output'] = captured_output.getvalue()
        except Exception as e:
            result['error'] = str(e)
            result['success'] = False
        finally:
            sys.stdout = old_stdout

        return result
```

## Plugin Patterns

### Pattern 1: API Integration

Connect to external APIs:

```python
class APIPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.api_url = "https://api.example.com"
        self.api_key = os.getenv('API_KEY')

    def execute(self, context):
        endpoint = context.get('endpoint')
        params = context.get('params', {})

        response = requests.post(
            f"{self.api_url}/{endpoint}",
            json=params,
            headers={'Authorization': f'Bearer {self.api_key}'}
        )

        return response.json()
```

### Pattern 2: Database Operations

Store and retrieve data:

```python
class DatabasePlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.db = self._connect_db()

    def execute(self, context):
        operation = context.get('operation')

        if operation == 'save':
            return self._save(context['data'])
        elif operation == 'query':
            return self._query(context['query'])

    def _connect_db(self):
        # Connect to database
        pass
```

### Pattern 3: File Operations

Read and write files:

```python
class FilePlugin(BasePlugin):
    def execute(self, context):
        action = context.get('action')
        filepath = context.get('filepath')

        if action == 'read':
            with open(filepath, 'r') as f:
                content = f.read()
            return {'content': content}

        elif action == 'write':
            content = context.get('content')
            with open(filepath, 'w') as f:
                f.write(content)
            return {'message': 'File written successfully'}
```

## Best Practices

### 1. Input Validation

Always validate input parameters:

```python
def execute(self, context):
    # Validate required fields
    is_valid, error = self.validate_context(
        context,
        ['required_field1', 'required_field2']
    )
    if not is_valid:
        raise ValueError(error)

    # Validate field types
    if not isinstance(context['field'], str):
        raise TypeError("field must be a string")

    # Validate field values
    if context['field'] not in ['valid1', 'valid2']:
        raise ValueError("field must be one of: valid1, valid2")
```

### 2. Error Handling

Handle errors gracefully:

```python
def execute(self, context):
    try:
        result = self._risky_operation(context)
        return {
            'success': True,
            'result': result
        }
    except SpecificError as e:
        return {
            'success': False,
            'error': f"Specific error occurred: {str(e)}"
        }
    except Exception as e:
        return {
            'success': False,
            'error': f"Unexpected error: {str(e)}"
        }
```

### 3. Resource Management

Clean up resources:

```python
def __init__(self):
    super().__init__()
    self.connection = None

def execute(self, context):
    try:
        if not self.connection:
            self.connection = self._connect()

        result = self._use_connection(context)
        return result
    finally:
        # Don't close persistent connections here
        pass

def __del__(self):
    # Clean up when plugin is destroyed
    if self.connection:
        self.connection.close()
```

### 4. Documentation

Document your plugin well:

```python
class MyPlugin(BasePlugin):
    """
    One-line description

    Detailed description of what the plugin does,
    when to use it, and any limitations.

    Context Parameters:
        param1 (str): Description of param1
        param2 (int, optional): Description of param2

    Returns:
        dict: Description of return value structure

    Example:
        >>> plugin = MyPlugin()
        >>> result = plugin.execute({
        ...     'param1': 'value',
        ...     'param2': 42
        ... })
    """
```

## Plugin Configuration

### Environment Variables

Use environment variables for configuration:

```python
import os

class MyPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.api_key = os.getenv('MY_PLUGIN_API_KEY')
        self.enabled = os.getenv('MY_PLUGIN_ENABLED', 'true').lower() == 'true'

        if not self.api_key:
            print("Warning: MY_PLUGIN_API_KEY not set")
```

Add to `backend/.env`:
```env
MY_PLUGIN_API_KEY=your-key-here
MY_PLUGIN_ENABLED=true
```

### Plugin-Specific Config

Create a config file:

```python
# plugins/my_plugin_config.py
PLUGIN_CONFIG = {
    'timeout': 30,
    'max_retries': 3,
    'cache_enabled': True
}
```

Load in plugin:
```python
from .my_plugin_config import PLUGIN_CONFIG

class MyPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.config = PLUGIN_CONFIG
```

## Testing Plugins

### Unit Tests

Create `tests/test_plugins.py`:

```python
import unittest
from app.plugins.my_plugin import MyPlugin

class TestMyPlugin(unittest.TestCase):
    def setUp(self):
        self.plugin = MyPlugin()

    def test_execute_success(self):
        context = {'required_param': 'value'}
        result = self.plugin.execute(context)

        self.assertTrue(result['success'])
        self.assertIn('result', result)

    def test_execute_missing_param(self):
        context = {}

        with self.assertRaises(ValueError):
            self.plugin.execute(context)

if __name__ == '__main__':
    unittest.main()
```

Run tests:
```bash
python -m pytest tests/test_plugins.py
```

## Advanced Features

### Async Plugins

For async operations:

```python
import asyncio

class AsyncPlugin(BasePlugin):
    async def execute_async(self, context):
        result = await self._async_operation(context)
        return result

    def execute(self, context):
        # Wrapper for sync interface
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(self.execute_async(context))

    async def _async_operation(self, context):
        # Async implementation
        await asyncio.sleep(1)
        return {'status': 'completed'}
```

### Plugin Dependencies

If your plugin depends on other plugins:

```python
from app.plugins.registry import get_registry

class DependentPlugin(BasePlugin):
    def execute(self, context):
        registry = get_registry()

        # Use another plugin
        other_plugin = registry.get_plugin('OtherPlugin')
        other_result = other_plugin.execute({'param': 'value'})

        # Use result
        return self._process(other_result)
```

### Caching Results

Cache expensive operations:

```python
from functools import lru_cache

class CachedPlugin(BasePlugin):
    @lru_cache(maxsize=128)
    def _expensive_operation(self, key):
        # Expensive computation
        return result

    def execute(self, context):
        key = context['key']
        result = self._expensive_operation(key)
        return {'result': result}
```

## Publishing Plugins

To share your plugin:

1. Create a separate repository
2. Add installation instructions
3. Document context parameters
4. Provide usage examples

Example README:

```markdown
# My Awesome Plugin

Description of what your plugin does.

## Installation

1. Copy `my_plugin.py` to `backend/app/plugins/`
2. Install dependencies: `pip install -r requirements.txt`
3. Restart backend

## Usage

```python
context = {
    'param1': 'value'
}
```

## Configuration

Add to `.env`:
```
MY_PLUGIN_KEY=your-key
```
```

## Troubleshooting

### Plugin Not Discovered

- Check filename doesn't start with `_`
- Ensure class inherits from `BasePlugin`
- Check for syntax errors
- Restart backend server

### Import Errors

- Install missing dependencies
- Check Python path
- Verify file location

### Plugin Fails Silently

- Add logging:
```python
import logging
logger = logging.getLogger(__name__)

class MyPlugin(BasePlugin):
    def execute(self, context):
        logger.info(f"Executing with context: {context}")
        # ...
```

## Next Steps

- Study example plugins in `app/plugins/`
- Read [API.md](API.md) for API integration
- Check [SETUP.md](SETUP.md) for development setup
- Join discussions on GitHub

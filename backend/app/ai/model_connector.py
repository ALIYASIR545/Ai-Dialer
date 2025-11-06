"""
AI Model Connector
Abstraction layer for different AI models (HuggingFace, OpenAI, etc.)
"""

import torch
from transformers import AutoModelForCausalLM, AutoModelForSeq2SeqLM, AutoTokenizer
from config import Config


class ModelConnector:
    """Base class for AI model connectors"""

    def __init__(self):
        self.model_type = Config.AI_MODEL_TYPE

    def generate_response(self, prompt, conversation_history=None, **kwargs):
        """Generate AI response - to be implemented by subclasses"""
        raise NotImplementedError


class HuggingFaceConnector(ModelConnector):
    """HuggingFace model connector using transformers library"""

    def __init__(self):
        super().__init__()
        self.model_name = Config.AI_MODEL_NAME
        self.tokenizer = None
        self.model = None
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        # Determine if this is a seq2seq model (like BlenderBot) or causal (like GPT)
        self.is_seq2seq = 'blenderbot' in self.model_name.lower() or 'bart' in self.model_name.lower() or 't5' in self.model_name.lower()
        self.load_model()

    def load_model(self):
        """Load the HuggingFace model"""
        print(f"Loading model: {self.model_name} on {self.device}")

        try:
            # Only use token if provided and not None/empty
            token_param = Config.HUGGINGFACE_TOKEN if Config.HUGGINGFACE_TOKEN else None

            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                token=token_param,
                padding_side='left' if not self.is_seq2seq else 'right'
            )

            # Use Seq2Seq model for BlenderBot-style models, CausalLM for GPT-style
            if self.is_seq2seq:
                self.model = AutoModelForSeq2SeqLM.from_pretrained(
                    self.model_name,
                    token=token_param,
                    torch_dtype=torch.float16 if self.device == 'cuda' else torch.float32,
                    low_cpu_mem_usage=True
                ).to(self.device)
            else:
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_name,
                    token=token_param,
                    torch_dtype=torch.float16 if self.device == 'cuda' else torch.float32,
                    low_cpu_mem_usage=True
                ).to(self.device)

            # Set pad token if not set
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token

            print(f"Model loaded successfully on {self.device}")

        except Exception as e:
            print(f"Error loading model: {e}")
            raise

    def generate_response(self, prompt, conversation_history=None, **kwargs):
        """
        Generate response using HuggingFace model

        Args:
            prompt: User's message
            conversation_history: List of previous messages
            **kwargs: Additional generation parameters

        Returns:
            str: Generated response
        """
        try:
            # Build conversation context
            system_message = kwargs.get('system_message', None)
            context = self._build_context(prompt, conversation_history, system_message)

            if self.is_seq2seq:
                # For Seq2Seq models (BlenderBot), use encoder-decoder architecture
                inputs = self.tokenizer(
                    context,
                    return_tensors='pt',
                    truncation=True,
                    max_length=512
                ).to(self.device)

                with torch.no_grad():
                    outputs = self.model.generate(
                        **inputs,
                        max_length=Config.MAX_LENGTH,
                        temperature=kwargs.get('temperature', Config.TEMPERATURE),
                        top_p=kwargs.get('top_p', Config.TOP_P),
                        do_sample=True,
                        num_return_sequences=1
                    )

                response = self.tokenizer.decode(
                    outputs[0],
                    skip_special_tokens=True
                ).strip()
            else:
                # For Causal LM models (GPT-style), use autoregressive generation
                inputs = self.tokenizer.encode(
                    context + self.tokenizer.eos_token,
                    return_tensors='pt',
                    truncation=True,
                    max_length=1000
                ).to(self.device)

                with torch.no_grad():
                    outputs = self.model.generate(
                        inputs,
                        max_length=inputs.shape[1] + Config.MAX_LENGTH,
                        temperature=kwargs.get('temperature', Config.TEMPERATURE),
                        top_p=kwargs.get('top_p', Config.TOP_P),
                        do_sample=True,
                        pad_token_id=self.tokenizer.pad_token_id,
                        eos_token_id=self.tokenizer.eos_token_id,
                        num_return_sequences=1
                    )

                response = self.tokenizer.decode(
                    outputs[0][inputs.shape[1]:],
                    skip_special_tokens=True
                ).strip()

            # Fallback if empty
            if not response:
                response = "I'm here to help. Could you please rephrase that?"

            return response

        except Exception as e:
            print(f"Error generating response: {e}")
            return "I apologize, but I encountered an error processing your request."

    def _build_context(self, prompt, conversation_history, system_message=None):
        """Build conversation context from history"""
        context = ""

        # Add system instruction as first user message (DialoGPT doesn't have system role)
        if system_message and not conversation_history:
            context += f"System: {system_message}{self.tokenizer.eos_token}"

        if conversation_history:
            # Get last N messages
            recent_history = conversation_history[-Config.MAX_CONVERSATION_HISTORY:]

            for msg in recent_history:
                if msg['role'] == 'user':
                    context += f"User: {msg['content']}{self.tokenizer.eos_token}"
                elif msg['role'] == 'assistant':
                    context += f"Assistant: {msg['content']}{self.tokenizer.eos_token}"

        context += f"User: {prompt}{self.tokenizer.eos_token}Assistant:"
        return context


class OpenAIConnector(ModelConnector):
    """OpenAI API connector (optional)"""

    def __init__(self):
        super().__init__()
        if not Config.OPENAI_API_KEY:
            raise ValueError("OpenAI API key not configured")

        try:
            import openai
            self.client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)
            self.model = Config.OPENAI_MODEL
        except ImportError:
            raise ImportError("openai package not installed. Run: pip install openai")

    def generate_response(self, prompt, conversation_history=None, **kwargs):
        """Generate response using OpenAI API"""
        try:
            messages = []

            # System message
            system_message = kwargs.get('system_message', 'You are a helpful AI assistant.')
            messages.append({"role": "system", "content": system_message})

            # Add conversation history
            if conversation_history:
                recent_history = conversation_history[-Config.MAX_CONVERSATION_HISTORY:]
                for msg in recent_history:
                    messages.append({
                        "role": msg['role'],
                        "content": msg['content']
                    })

            # Add current prompt
            messages.append({"role": "user", "content": prompt})

            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=kwargs.get('temperature', Config.TEMPERATURE),
                max_tokens=kwargs.get('max_tokens', Config.MAX_LENGTH)
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"Error with OpenAI API: {e}")
            return "I apologize, but I encountered an error processing your request."


def get_model_connector():
    """Factory function to get the appropriate model connector"""
    if Config.AI_MODEL_TYPE == 'huggingface':
        return HuggingFaceConnector()
    elif Config.AI_MODEL_TYPE == 'openai':
        return OpenAIConnector()
    else:
        raise ValueError(f"Unknown model type: {Config.AI_MODEL_TYPE}")


# Global model instance (loaded once)
_model_instance = None


def get_model():
    """Get or create global model instance"""
    global _model_instance
    if _model_instance is None:
        _model_instance = get_model_connector()
    return _model_instance

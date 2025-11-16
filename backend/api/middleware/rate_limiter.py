"""
Rate Limiting Configuration

This module configures slowapi rate limiter for the application.
Rate limits are applied to prevent abuse and ensure fair resource usage.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from config.settings import get_settings


# Initialize the limiter
limiter = Limiter(key_func=get_remote_address)

# Get rate limits from settings
settings = get_settings()
SUBMIT_RATE_LIMIT = settings.rate_limit_submit
STREAM_RATE_LIMIT = settings.rate_limit_stream

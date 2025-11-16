"""
Rate Limiting via slowapi
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from lib.config.settings import get_settings  # ← Updated import

limiter = Limiter(key_func=get_remote_address)

settings = get_settings()
SUBMIT_RATE_LIMIT = settings.rate_limit_submit
STREAM_RATE_LIMIT = settings.rate_limit_stream

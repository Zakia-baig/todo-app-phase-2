import logging
from typing import Any
import json
from datetime import datetime


class Logger:
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)

        # Create console handler
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)

        # Create formatter
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)

        # Add handler to logger
        if not self.logger.handlers:
            self.logger.addHandler(handler)

    def info(self, message: str, **kwargs: Any):
        if kwargs:
            self.logger.info(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.info(message)

    def error(self, message: str, **kwargs: Any):
        if kwargs:
            self.logger.error(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.error(message)

    def warning(self, message: str, **kwargs: Any):
        if kwargs:
            self.logger.warning(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.warning(message)

    def debug(self, message: str, **kwargs: Any):
        if kwargs:
            self.logger.debug(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.debug(message)


# Global logger instance
app_logger = Logger(__name__)
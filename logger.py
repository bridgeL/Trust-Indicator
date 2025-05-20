import os
import logging
from logging.handlers import TimedRotatingFileHandler


def setup_logger():
    log_dir = "log"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    log_file = os.path.join(log_dir, "flask_app.log")
    file_handler = TimedRotatingFileHandler(
        log_file,
        when="midnight",
        interval=1,
        backupCount=1440,
        encoding="utf-8",
    )

    console_handler = logging.StreamHandler()

    werkzeug_logger = logging.getLogger("werkzeug")
    werkzeug_logger.addHandler(file_handler)
    werkzeug_logger.addHandler(console_handler)


def print(*args):
    s = " ".join(str(a) for a in args)
    werkzeug_logger = logging.getLogger("werkzeug")
    werkzeug_logger.info(s)

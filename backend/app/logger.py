import logging

from pythonjsonlogger import jsonlogger

logger = logging.getLogger("app")

logHandler = logging.StreamHandler()

formatter = jsonlogger.JsonFormatter()

logHandler.setFormatter(formatter)

logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

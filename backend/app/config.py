
import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = "ClimateTwin API"
APP_VERSION = "1.0.0"

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

OPEN_METEO_WEATHER_URL = (
    "https://api.open-meteo.com/v1/forecast"
)

OPEN_METEO_AIR_URL = (
    "https://air-quality-api.open-meteo.com/v1/air-quality"
)

REQUEST_TIMEOUT = 30.0

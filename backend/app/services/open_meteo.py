
import asyncio
from datetime import datetime, timezone

import httpx

from app.config import (
    OPEN_METEO_WEATHER_URL,
    OPEN_METEO_AIR_URL,
    REQUEST_TIMEOUT
)


class EnvironmentalDataError(Exception):
    pass


async def fetch_weather(latitude, longitude):

    params = {
        "latitude": latitude,
        "longitude": longitude,

        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "apparent_temperature,"
            "precipitation,"
            "rain,"
            "showers,"
            "weather_code,"
            "wind_speed_10m"
        ),

        "hourly": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "precipitation_probability"
        ),

        "daily": (
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_sum,"
            "precipitation_probability_max"
        ),

        "forecast_days": 3,
        "timezone": "auto"
    }

    async with httpx.AsyncClient(
        timeout=REQUEST_TIMEOUT
    ) as client:

        response = await client.get(
            OPEN_METEO_WEATHER_URL,
            params=params
        )

        response.raise_for_status()

        return response.json()


async def fetch_air_quality(latitude, longitude):

    params = {
        "latitude": latitude,
        "longitude": longitude,

        "current": (
            "european_aqi,"
            "us_aqi,"
            "pm2_5,"
            "pm10,"
            "nitrogen_dioxide,"
            "ozone"
        ),

        "timezone": "auto"
    }

    async with httpx.AsyncClient(
        timeout=REQUEST_TIMEOUT
    ) as client:

        response = await client.get(
            OPEN_METEO_AIR_URL,
            params=params
        )

        response.raise_for_status()

        return response.json()


async def get_environmental_data(
    latitude,
    longitude
):

    try:

        weather, air = await asyncio.gather(
            fetch_weather(latitude, longitude),
            fetch_air_quality(latitude, longitude)
        )

        weather_current = weather.get("current", {})
        air_current = air.get("current", {})

        return {

            "success": True,

            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "timezone": weather.get("timezone")
            },

            "metadata": {
                "provider": "Open-Meteo",
                "retrieved_at": datetime.now(
                    timezone.utc
                ).isoformat(),

                "weather_data_time": weather_current.get(
                    "time"
                ),

                "air_quality_data_time": air_current.get(
                    "time"
                ),

                "weather_grid_location": {
                    "latitude": weather.get("latitude"),
                    "longitude": weather.get("longitude")
                },

                "air_quality_grid_location": {
                    "latitude": air.get("latitude"),
                    "longitude": air.get("longitude")
                }
            },

            "weather": {

                "temperature_c": weather_current.get(
                    "temperature_2m"
                ),

                "feels_like_c": weather_current.get(
                    "apparent_temperature"
                ),

                "humidity_percent": weather_current.get(
                    "relative_humidity_2m"
                ),

                "precipitation_mm": weather_current.get(
                    "precipitation"
                ),

                "rain_mm": weather_current.get(
                    "rain"
                ),

                "showers_mm": weather_current.get(
                    "showers"
                ),

                "wind_speed_kmh": weather_current.get(
                    "wind_speed_10m"
                ),

                "weather_code": weather_current.get(
                    "weather_code"
                )
            },

            "air_quality": {

                "european_aqi": air_current.get(
                    "european_aqi"
                ),

                "us_aqi": air_current.get(
                    "us_aqi"
                ),

                "pm25_ug_m3": air_current.get(
                    "pm2_5"
                ),

                "pm10_ug_m3": air_current.get(
                    "pm10"
                ),

                "nitrogen_dioxide_ug_m3": air_current.get(
                    "nitrogen_dioxide"
                ),

                "ozone_ug_m3": air_current.get(
                    "ozone"
                )
            },

            "forecast": {

                "hourly": weather.get(
                    "hourly", {}
                ),

                "daily": weather.get(
                    "daily", {}
                )
            }
        }

    except httpx.TimeoutException as exc:

        raise EnvironmentalDataError(
            "Environmental API request timed out."
        ) from exc

    except httpx.HTTPStatusError as exc:

        raise EnvironmentalDataError(
            f"Environmental API returned HTTP "
            f"{exc.response.status_code}."
        ) from exc

    except httpx.RequestError as exc:

        raise EnvironmentalDataError(
            "Unable to connect to environmental API."
        ) from exc

    except (KeyError, TypeError, ValueError) as exc:

        raise EnvironmentalDataError(
            "Invalid environmental API response."
        ) from exc

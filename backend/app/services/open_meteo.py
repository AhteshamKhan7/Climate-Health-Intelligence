
import asyncio
from datetime import datetime, timezone

import httpx

from app.config import (
    OPEN_METEO_WEATHER_URL,
    OPEN_METEO_AIR_URL,
    REQUEST_TIMEOUT,
)


class EnvironmentalDataError(Exception):
    pass


# Prevent too many simultaneous requests to the external API.
_REQUEST_SEMAPHORE = asyncio.Semaphore(4)

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 0.5


async def _request_json(client, url, params):
    """
    Make an API request with limited concurrency and automatic retries.
    """

    for attempt in range(MAX_RETRIES):
        try:
            async with _REQUEST_SEMAPHORE:
                response = await client.get(url, params=params)

            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code

            # Retry only temporary server/rate-limit errors.
            if status_code not in (429, 500, 502, 503, 504):
                raise

            if attempt == MAX_RETRIES - 1:
                raise

        except (httpx.TimeoutException, httpx.RequestError):
            if attempt == MAX_RETRIES - 1:
                raise

        await asyncio.sleep(
            RETRY_DELAY_SECONDS * (2 ** attempt)
        )

    raise EnvironmentalDataError(
        "Environmental API request failed after retries."
    )


async def fetch_weather(client, latitude, longitude):

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
        "timezone": "auto",
    }

    return await _request_json(
        client,
        OPEN_METEO_WEATHER_URL,
        params,
    )


async def fetch_air_quality(client, latitude, longitude):

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

        "timezone": "auto",
    }

    return await _request_json(
        client,
        OPEN_METEO_AIR_URL,
        params,
    )


async def get_environmental_data(latitude, longitude):

    try:
        async with httpx.AsyncClient(
            timeout=REQUEST_TIMEOUT
        ) as client:

            weather, air = await asyncio.gather(
                fetch_weather(client, latitude, longitude),
                fetch_air_quality(client, latitude, longitude),
            )

        weather_current = weather.get("current", {})
        air_current = air.get("current", {})

        return {
            "success": True,

            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "timezone": weather.get("timezone"),
            },

            "metadata": {
                "provider": "Open-Meteo",

                "retrieved_at": datetime.now(
                    timezone.utc
                ).isoformat(),

                "weather_data_time": weather_current.get("time"),
                "air_quality_data_time": air_current.get("time"),

                "weather_grid_location": {
                    "latitude": weather.get("latitude"),
                    "longitude": weather.get("longitude"),
                },

                "air_quality_grid_location": {
                    "latitude": air.get("latitude"),
                    "longitude": air.get("longitude"),
                },
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

                "rain_mm": weather_current.get("rain"),
                "showers_mm": weather_current.get("showers"),

                "wind_speed_kmh": weather_current.get(
                    "wind_speed_10m"
                ),

                "weather_code": weather_current.get(
                    "weather_code"
                ),
            },

            "air_quality": {
                "european_aqi": air_current.get("european_aqi"),
                "us_aqi": air_current.get("us_aqi"),

                "pm25_ug_m3": air_current.get("pm2_5"),
                "pm10_ug_m3": air_current.get("pm10"),

                "nitrogen_dioxide_ug_m3": air_current.get(
                    "nitrogen_dioxide"
                ),

                "ozone_ug_m3": air_current.get("ozone"),
            },

            "forecast": {
                "hourly": weather.get("hourly", {}),
                "daily": weather.get("daily", {}),
            },
        }

    except httpx.TimeoutException as exc:
        raise EnvironmentalDataError(
            "Environmental API request timed out after retries."
        ) from exc

    except httpx.HTTPStatusError as exc:
        raise EnvironmentalDataError(
            f"Environmental API returned HTTP "
            f"{exc.response.status_code}."
        ) from exc

    except httpx.RequestError as exc:
        raise EnvironmentalDataError(
            "Unable to connect to environmental API after retries."
        ) from exc

    except (KeyError, TypeError, ValueError) as exc:
        raise EnvironmentalDataError(
            "Invalid environmental API response."
        ) from exc

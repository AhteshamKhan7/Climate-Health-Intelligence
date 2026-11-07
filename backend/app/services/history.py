
import json
import sqlite3
from pathlib import Path
from typing import Any


# Database location:
# backend/data/climatetwin.db
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = DATA_DIR / "climatetwin.db"


def get_connection():
    """Create a SQLite connection and return rows as dictionaries."""

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row

    return connection


def initialize_history_db():
    """Create the historical assessment table and indexes."""

    with get_connection() as connection:

        connection.execute("""
            CREATE TABLE IF NOT EXISTS assessments (
                assessment_id TEXT PRIMARY KEY,
                generated_at TEXT NOT NULL,

                location_name TEXT,
                latitude REAL,
                longitude REAL,

                community_profile TEXT,

                overall_score REAL,
                classification TEXT,
                dominant_hazard TEXT,

                heat_score REAL,
                air_score REAL,
                rain_score REAL,

                assessment_json TEXT NOT NULL
            )
        """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_assessments_location
            ON assessments(latitude, longitude)
        """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_assessments_generated_at
            ON assessments(generated_at)
        """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_assessments_profile
            ON assessments(community_profile)
        """)


def save_assessment(assessment: dict[str, Any]):
    """
    Save one complete climate-health assessment.

    The full assessment is preserved as JSON so future
    modules can use fields that are not yet database columns.
    """

    if not isinstance(assessment, dict):
        raise ValueError("Assessment must be a dictionary.")

    assessment_id = assessment.get("assessment_id")
    generated_at = assessment.get("generated_at")

    if not assessment_id or not generated_at:
        raise ValueError(
            "Assessment ID and generated timestamp are required."
        )

    location = assessment.get("location") or {}
    overall = assessment.get("overall_risk") or {}
    hazards = assessment.get("hazards") or {}
    community = assessment.get("community") or {}

    heat_score = (hazards.get("heat") or {}).get("risk_score")
    air_score = (hazards.get("air") or {}).get("risk_score")
    rain_score = (hazards.get("rain") or {}).get("risk_score")

    assessment_json = json.dumps(
        assessment,
        ensure_ascii=False,
        allow_nan=False
    )

    with get_connection() as connection:

        connection.execute("""
            INSERT OR REPLACE INTO assessments (
                assessment_id,
                generated_at,
                location_name,
                latitude,
                longitude,
                community_profile,
                overall_score,
                classification,
                dominant_hazard,
                heat_score,
                air_score,
                rain_score,
                assessment_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            assessment_id,
            generated_at,
            location.get("name"),
            location.get("latitude"),
            location.get("longitude"),
            community.get("profile"),
            overall.get("score"),
            overall.get("classification"),
            overall.get("dominant_hazard"),
            heat_score,
            air_score,
            rain_score,
            assessment_json
        ))

    return assessment_id


def get_assessment_history(
    location_name: str | None = None,
    community_profile: str | None = None,
    limit: int = 50
):
    """Retrieve saved assessments, newest first."""

    limit = max(1, min(limit, 500))

    query = """
        SELECT *
        FROM assessments
        WHERE 1 = 1
    """

    parameters = []

    if location_name:
        query += " AND location_name LIKE ?"
        parameters.append(f"%{location_name}%")

    if community_profile:
        query += " AND community_profile = ?"
        parameters.append(community_profile)

    query += " ORDER BY generated_at DESC LIMIT ?"
    parameters.append(limit)

    with get_connection() as connection:

        rows = connection.execute(
            query,
            parameters
        ).fetchall()

    results = []

    for row in rows:

        item = dict(row)
        item["assessment"] = json.loads(
            item.pop("assessment_json")
        )

        results.append(item)

    return results


def get_history_count():
    """Return the total number of stored assessments."""

    with get_connection() as connection:

        row = connection.execute("""
            SELECT COUNT(*) AS total
            FROM assessments
        """).fetchone()

    return row["total"]

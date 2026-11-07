
import json
import sqlite3
import uuid

from datetime import datetime, timezone
from typing import Any

from app.services.history import get_connection


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def initialize_alerts_db() -> None:
    """Create the alert table and its indexes."""

    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                alert_id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                last_seen_at TEXT NOT NULL,

                location_name TEXT,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,

                community_profile TEXT NOT NULL,
                hazard TEXT NOT NULL,

                risk_score REAL NOT NULL,
                severity TEXT NOT NULL,

                title TEXT NOT NULL,
                message TEXT NOT NULL,

                status TEXT NOT NULL DEFAULT 'active',

                assessment_id TEXT,
                alert_json TEXT NOT NULL
            )
        """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_alerts_location
            ON alerts(location_name)
        """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_alerts_status
            ON alerts(status)
        """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_alerts_created_at
            ON alerts(created_at)
        """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_alerts_hazard
            ON alerts(hazard)
        """)


def create_or_update_alert(alert: dict[str, Any]) -> dict:
    """
    Create an alert or refresh an existing unresolved alert
    for the same location, community and hazard.

    Acknowledged alerts remain acknowledged when refreshed.
    Resolved alerts do not prevent a new alert from being created.
    """

    required_fields = [
        "latitude",
        "longitude",
        "community_profile",
        "hazard",
        "risk_score",
        "severity",
        "title",
        "message"
    ]

    for field in required_fields:
        if field not in alert:
            raise ValueError(f"Missing required alert field: {field}")

    now = utc_now()

    with get_connection() as connection:
        existing = connection.execute("""
            SELECT *
            FROM alerts
            WHERE
                ABS(latitude - ?) < 0.000001
                AND ABS(longitude - ?) < 0.000001
                AND community_profile = ?
                AND hazard = ?
                AND status IN ('active', 'acknowledged')
            ORDER BY created_at DESC
            LIMIT 1
        """, (
            alert["latitude"],
            alert["longitude"],
            alert["community_profile"],
            alert["hazard"]
        )).fetchone()

        if existing:
            existing_data = dict(existing)

            refreshed = {
                **alert,
                "alert_id": existing_data["alert_id"],
                "created_at": existing_data["created_at"],
                "updated_at": now,
                "last_seen_at": now,
                "status": existing_data["status"]
            }

            connection.execute("""
                UPDATE alerts
                SET
                    updated_at = ?,
                    last_seen_at = ?,
                    location_name = ?,
                    risk_score = ?,
                    severity = ?,
                    title = ?,
                    message = ?,
                    assessment_id = ?,
                    alert_json = ?
                WHERE alert_id = ?
            """, (
                now,
                now,
                alert.get("location_name"),
                alert["risk_score"],
                alert["severity"],
                alert["title"],
                alert["message"],
                alert.get("assessment_id"),
                json.dumps(refreshed, ensure_ascii=False, allow_nan=False),
                existing_data["alert_id"]
            ))

            return {
                **refreshed,
                "action": "updated"
            }

        alert_id = f"ALT-{uuid.uuid4().hex[:12].upper()}"

        new_alert = {
            **alert,
            "alert_id": alert_id,
            "created_at": now,
            "updated_at": now,
            "last_seen_at": now,
            "status": "active"
        }

        connection.execute("""
            INSERT INTO alerts (
                alert_id,
                created_at,
                updated_at,
                last_seen_at,
                location_name,
                latitude,
                longitude,
                community_profile,
                hazard,
                risk_score,
                severity,
                title,
                message,
                status,
                assessment_id,
                alert_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            alert_id,
            now,
            now,
            now,
            alert.get("location_name"),
            alert["latitude"],
            alert["longitude"],
            alert["community_profile"],
            alert["hazard"],
            alert["risk_score"],
            alert["severity"],
            alert["title"],
            alert["message"],
            "active",
            alert.get("assessment_id"),
            json.dumps(new_alert, ensure_ascii=False, allow_nan=False)
        ))

        return {
            **new_alert,
            "action": "created"
        }


def get_alerts(
    location: str | None = None,
    community_profile: str | None = None,
    status: str | None = None,
    severity: str | None = None,
    limit: int = 50
) -> list[dict]:
    """Retrieve alerts with optional filters, newest first."""

    limit = max(1, min(limit, 500))

    query = "SELECT * FROM alerts WHERE 1 = 1"
    parameters = []

    if location:
        query += " AND location_name LIKE ?"
        parameters.append(f"%{location}%")

    if community_profile:
        query += " AND community_profile = ?"
        parameters.append(community_profile)

    if status:
        query += " AND status = ?"
        parameters.append(status)

    if severity:
        query += " AND severity = ?"
        parameters.append(severity)

    query += " ORDER BY updated_at DESC LIMIT ?"
    parameters.append(limit)

    with get_connection() as connection:
        rows = connection.execute(query, parameters).fetchall()

    results = []

    for row in rows:
        item = dict(row)
        item["alert"] = json.loads(item.pop("alert_json"))
        results.append(item)

    return results


def get_alert_by_id(alert_id: str) -> dict | None:
    """Retrieve one alert by its ID."""

    with get_connection() as connection:
        row = connection.execute("""
            SELECT *
            FROM alerts
            WHERE alert_id = ?
        """, (alert_id,)).fetchone()

    if row is None:
        return None

    item = dict(row)
    item["alert"] = json.loads(item.pop("alert_json"))

    return item


def update_alert_status(
    alert_id: str,
    new_status: str
) -> dict | None:
    """Update an alert's status."""

    allowed_statuses = {
        "active",
        "acknowledged",
        "resolved"
    }

    if new_status not in allowed_statuses:
        raise ValueError(
            f"Status must be one of: {', '.join(sorted(allowed_statuses))}"
        )

    now = utc_now()

    with get_connection() as connection:
        row = connection.execute("""
            SELECT *
            FROM alerts
            WHERE alert_id = ?
        """, (alert_id,)).fetchone()

        if row is None:
            return None

        item = dict(row)
        alert_data = json.loads(item["alert_json"])

        alert_data["status"] = new_status
        alert_data["updated_at"] = now

        connection.execute("""
            UPDATE alerts
            SET
                status = ?,
                updated_at = ?,
                alert_json = ?
            WHERE alert_id = ?
        """, (
            new_status,
            now,
            json.dumps(alert_data, ensure_ascii=False, allow_nan=False),
            alert_id
        ))

    return get_alert_by_id(alert_id)


def get_alert_count() -> int:
    """Return total stored alert records."""

    with get_connection() as connection:
        row = connection.execute("""
            SELECT COUNT(*) AS total
            FROM alerts
        """).fetchone()

    return row["total"]

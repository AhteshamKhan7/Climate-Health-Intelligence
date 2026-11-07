
def generate_community_recommendations(
    hazard_scores: dict,
    profile_name: str
) -> dict:

    recommendations = []

    heat = hazard_scores.get("heat")
    air = hazard_scores.get("air")
    rain = hazard_scores.get("rain")

    # HEAT RECOMMENDATIONS
    if heat is not None and heat >= 40:

        recommendations.append({
            "hazard": "heat",
            "priority": "high" if heat >= 60 else "moderate",
            "actions": [
                "Maintain adequate hydration.",
                "Avoid prolonged outdoor exposure during hot periods.",
                "Monitor official heat-health advisories."
            ]
        })

    # AIR POLLUTION RECOMMENDATIONS
    if air is not None and air >= 40:

        actions = [
            "Monitor official air-quality advisories.",
            "Reduce prolonged outdoor exposure when pollution is elevated."
        ]

        if profile_name == "elderly":
            actions.append(
                "Check on older adults during periods of poor air quality."
            )

        elif profile_name == "children":
            actions.append(
                "Limit prolonged outdoor activities for children during poor air quality."
            )

        elif profile_name == "outdoor_workers":
            actions.append(
                "Review outdoor work schedules and provide suitable rest areas."
            )

        elif profile_name == "flood_affected":
            actions.append(
                "Monitor air quality and maintain a safe indoor environment."
            )

        recommendations.append({
            "hazard": "air",
            "priority": "high" if air >= 60 else "moderate",
            "actions": actions
        })

    # RAINFALL RECOMMENDATIONS
    if rain is not None and rain >= 40:

        actions = [
            "Monitor official rainfall and flood warnings.",
            "Avoid walking or driving through floodwater."
        ]

        if profile_name == "flood_affected":
            actions.extend([
                "Identify safe shelter locations.",
                "Prioritize safe drinking water and sanitation.",
                "Follow local evacuation instructions when issued."
            ])

        recommendations.append({
            "hazard": "rain",
            "priority": "high" if rain >= 60 else "moderate",
            "actions": actions
        })

    # COMMUNITY-SPECIFIC AWARENESS
    community_actions = {
        "general": [
            "Stay informed through official weather and health advisories."
        ],

        "elderly": [
            "Arrange regular wellbeing checks during extreme weather."
        ],

        "children": [
            "Ensure access to safe drinking water and weather protection."
        ],

        "outdoor_workers": [
            "Provide accessible drinking water and shaded rest areas."
        ],

        "flood_affected": [
            "Keep emergency supplies and safe drinking water accessible."
        ]
    }

    if profile_name not in community_actions:
        raise ValueError("Unsupported community profile.")

    return {
        "community_profile": profile_name,
        "recommendations": recommendations,
        "community_actions": community_actions[profile_name],
        "data_type": "Rule-based preventive awareness guidance",
        "medical_advice": False
    }

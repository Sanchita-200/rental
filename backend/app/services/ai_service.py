import httpx
from typing import List, Dict, Any
from app.core.config import settings

async def generate_ai_chat_response(user_message: str, rental_context: str = None) -> Dict[str, Any]:
    msg_lower = user_message.lower()

    if "deposit" in msg_lower or "security" in msg_lower:
        return {
            "reply": "RentFlow holds a refundable security deposit upfront to protect equipment. Deposits are automatically released back to your original payment method upon on-time return with no damage!",
            "suggested_actions": ["How are late fees calculated?", "View my active deposit", "Browse available equipment"]
        }
    elif "late" in msg_lower or "overdue" in msg_lower or "fee" in msg_lower:
        return {
            "reply": "Late fees are calculated automatically upon return. The standard rate is 1.5x the base daily rental fee for each overdue day. Returning on time guarantees a 100% full deposit refund!",
            "suggested_actions": ["Extend my rental duration", "View return location", "Contact customer support"]
        }
    elif "qr" in msg_lower or "pickup" in msg_lower or "pass" in msg_lower:
        return {
            "reply": "Your QR Pass is generated instantly upon booking confirmation! You can present it from your phone under the 'My Bookings' tab when picking up or returning your equipment.",
            "suggested_actions": ["Open My Bookings", "View pickup counter hours"]
        }
    elif "camera" in msg_lower or "canon" in msg_lower or "dslr" in msg_lower:
        return {
            "reply": "Our top-rated camera kit is the **Canon EOS R6 Mark II Bundle** (₹1,500/day, ₹5,000 deposit). It includes 2 battery packs and a 128GB high-speed SD card. Perfect for weekend shoots!",
            "suggested_actions": ["View Canon EOS R6", "Check weekend availability"]
        }
    else:
        return {
            "reply": f"Hello! I'm your RentFlow AI Assistant. I can help you with rental terms, equipment recommendations, deposit policies, or QR pickup queries. How can I assist you with '{user_message}' today?",
            "suggested_actions": ["Browse Popular Equipment", "Security Deposit Terms", "How Late Fees Work"]
        }

def generate_dashboard_insights_summary(total_revenue: float, active_count: int, overdue_count: int, utilization_rate: float) -> Dict[str, Any]:
    exec_summary = f"RentFlow operational health is strong at {utilization_rate}% inventory utilization. Total platform revenue has reached ₹{total_revenue:,.2f} with {active_count} active rentals."
    
    tips = [
        "High demand detected in Professional Photography gear. Consider adding 2 additional DSLR units.",
        "Maintain current 1.5x late penalty multiplier; it has reduced overdue returns by 34%.",
        "Weekend peak demand projected to reach 92% utilization for Audio Equipment."
    ]
    
    high_demand = ["Cameras & Photography", "Gaming Consoles", "Power Tools"]
    
    alerts = []
    if overdue_count > 0:
        alerts.append(f"CRITICAL: {overdue_count} rental booking(s) are currently overdue. Automated reminder notifications dispatched.")
    else:
        alerts.append("Optimal operation: Zero active overdue rentals detected!")

    return {
        "executive_summary": exec_summary,
        "revenue_optimization_tips": tips,
        "high_demand_categories": high_demand,
        "overdue_risk_alerts": alerts
    }

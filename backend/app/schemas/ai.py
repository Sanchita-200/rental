from pydantic import BaseModel
from typing import List, Optional

class AIChatRequest(BaseModel):
    message: str
    context_rental_id: Optional[str] = None

class AIChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []

class AIInsightsResponse(BaseModel):
    executive_summary: str
    revenue_optimization_tips: List[str]
    high_demand_categories: List[str]
    overdue_risk_alerts: List[str]

class AIDemandForecastItem(BaseModel):
    category_name: str
    projected_demand_growth: str
    pricing_recommendation: str

class AIDemandForecastResponse(BaseModel):
    forecast_period: str
    forecasts: List[AIDemandForecastItem]

from datetime import datetime, timezone
import math

LATE_FEE_MULTIPLIER = 1.5 # 150% of base daily rate for overdue days

def calculate_late_fee(expected_end_date: datetime, actual_return_date: datetime, item_daily_rate: float) -> tuple[float, int]:
    """
    Calculates late fee amount and overdue days count.
    Formula: overdue_days * (daily_rate * LATE_FEE_MULTIPLIER)
    """
    if actual_return_date.tzinfo is None:
        actual_return_date = actual_return_date.replace(tzinfo=timezone.utc)
    if expected_end_date.tzinfo is None:
        expected_end_date = expected_end_date.replace(tzinfo=timezone.utc)

    if actual_return_date <= expected_end_date:
        return 0.0, 0

    diff = actual_return_date - expected_end_date
    # Ceiling number of days (if returned 3 hours late, counts as 1 day late)
    overdue_days = math.ceil(diff.total_seconds() / 86400)
    
    if overdue_days <= 0:
        return 0.0, 0

    daily_penalty = item_daily_rate * LATE_FEE_MULTIPLIER
    total_late_fee = round(overdue_days * daily_penalty, 2)
    return total_late_fee, overdue_days

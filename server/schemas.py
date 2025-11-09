from typing import Any
from pydantic import BaseModel, Field
from pydantic.config import ConfigDict


class PredictPayload(BaseModel):
    # Numeric fields with validation
    tenure: int = Field(ge=0, description="Months as customer")
    MonthlyCharges: float = Field(ge=0, description="Monthly charges in dollars")
    TotalCharges: float = Field(ge=0, description="Total charges to date in dollars")
    SeniorCitizen: int = Field(ge=0, le=1, description="Senior citizen status (0 or 1)")

    # Allow extra fields for categorical features
    model_config = ConfigDict(extra='allow')

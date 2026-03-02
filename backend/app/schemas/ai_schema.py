from pydantic import BaseModel


class SmartAssistRequest(BaseModel):
    title: str
    type: str

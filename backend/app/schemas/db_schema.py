from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, HttpUrl


class ResourceType(str, Enum):
    video = "Video"
    pdf = "PDF"
    link = "Link"


class ResourceCreate(BaseModel):

    title: str
    description: str | None = None
    type: ResourceType
    url: HttpUrl
    tags: list[str] | None = None


class ResourceResponse(ResourceCreate):

    id: int

    class Config:
        from_attributes = True


class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    url: Optional[str] = None
    tags: Optional[List[str]] = None

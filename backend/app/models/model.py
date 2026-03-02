from sqlalchemy import JSON, Column, Integer, String, Text

from app.database import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    type = Column(String(50))
    url = Column(String(500))
    tags = Column(JSON)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.repositories.repository import (
    create_resource,
    delete_resource,
    get_resource_by_id,
    get_resources,
    update_resource,
)
from app.schemas.ai_schema import SmartAssistRequest
from app.schemas.db_schema import ResourceCreate, ResourceUpdate
from app.services.ai_service import generate_description

router = APIRouter(prefix="/resources")


def get_db():

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create(resource: ResourceCreate, db: Session = Depends(get_db)):

    return create_resource(db, resource)


@router.get("/")
def list_resources(page: int = 1, size: int = 10, db: Session = Depends(get_db)):

    skip = (page - 1) * size
    total, items = get_resources(db, skip, size)

    return {"total": total, "page": page, "size": size, "items": items}


@router.post("/smart-assist")
def smart_assist(data: SmartAssistRequest):

    return generate_description(data.title, data.type)


@router.get("/{resource_id}")
def get_by_id(resource_id: int, db: Session = Depends(get_db)):

    resource = get_resource_by_id(db, resource_id)

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    return resource


@router.put("/{resource_id}")
def update(resource_id: int, resource: ResourceUpdate, db: Session = Depends(get_db)):

    updated = update_resource(db, resource_id, resource)

    if not updated:
        raise HTTPException(status_code=404, detail="Resource not found")

    return updated


@router.delete("/{resource_id}")
def delete(resource_id: int, db: Session = Depends(get_db)):

    deleted = delete_resource(db, resource_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Resource not found")

    return {"message": "Resource deleted successfully"}

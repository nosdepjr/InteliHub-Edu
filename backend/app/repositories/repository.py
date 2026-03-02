from sqlalchemy.orm import Session

from app.models.model import Resource


def create_resource(db: Session, resource):
    data = resource.dict()

    data["url"] = str(data["url"])
    data["type"] = data["type"].value

    db_resource = Resource(**data)
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)

    return db_resource


def get_resources(db: Session, skip: int = 0, limit: int = 10):

    query = db.query(Resource)

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return total, items


def get_resource_by_id(db: Session, resource_id: int):
    return db.query(Resource).filter(Resource.id == resource_id).first()


def update_resource(db: Session, resource_id: int, data):

    db_resource = get_resource_by_id(db, resource_id)

    if not db_resource:
        return None

    for key, value in data.model_dump(exclude_unset=True).items():
        if key == "url" and value is not None:
            value = str(value)

        if key == "type" and value is not None:
            value = value.value if hasattr(value, "value") else value

    setattr(db_resource, key, value)

    db.commit()
    db.refresh(db_resource)

    return db_resource


def delete_resource(db: Session, resource_id: int):

    db_resource = get_resource_by_id(db, resource_id)

    if not db_resource:
        return None

    db.delete(db_resource)
    db.commit()

    return db_resource

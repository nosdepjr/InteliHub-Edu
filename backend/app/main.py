from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import health_router, resource_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hub Inteligente de Recursos Educacionais")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resource_router.router)
app.include_router(health_router.router)

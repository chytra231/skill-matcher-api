from pathlib import Path
from typing import List
import logging
import os
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import AnyHttpUrl, BaseModel, ConfigDict, EmailStr, Field, field_validator
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Candidate Job Matching API", version="1.0.0")
api_router = APIRouter(prefix="/api")


def clean_text_list(values: List[str]) -> List[str]:
    cleaned = [value.strip() for value in values]
    if any(not value for value in cleaned):
        raise ValueError("skills must not contain blank values")
    return cleaned


class CandidateFields(BaseModel):
    name: str = Field(min_length=1)
    contact_number: str = Field(min_length=1)
    email: EmailStr
    skills: List[str] = Field(min_length=1)
    qualification:

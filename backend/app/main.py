from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Retail Shelf Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DashboardItem(BaseModel):
    title: str
    value: str
    description: str
    icon: str


class StatusItem(BaseModel):
    label: str
    value: str


class DashboardResponse(BaseModel):
    summary: List[DashboardItem]
    status: List[StatusItem]


class MisplacedDetail(BaseModel):
    name: str
    rowNumber: str
    productNumber: int
    expectedProduct: str


class MissingDetail(BaseModel):
    name: str
    missingCount: int


class ResultsResponse(BaseModel):
    productsDetected: int
    misplacedCount: int
    missingCount: int
    shelfHealth: int
    healthy: int
    rearrangement: int
    confidence: int
    misplaced: List[str]
    missing: List[str]
    misplacedDetails: List[MisplacedDetail]
    missingDetails: List[MissingDetail]
    image: str


class AnalyzeResponse(BaseModel):
    success: bool
    analysisId: str
    processedAt: str


@app.get("/api/dashboard", response_model=DashboardResponse)
async def get_dashboard():
    return {
        "summary": [
            {"title": "Products Detected", "value": "1,278", "description": "Items analyzed in last 24h", "icon": "box"},
            {"title": "Misplaced Products", "value": "28", "description": "Detected position errors", "icon": "pin"},
            {"title": "Missing Products", "value": "12", "description": "Items needing restock", "icon": "tag"},
            {"title": "Shelf Health", "value": "92%", "description": "Optimal display score", "icon": "pulse"},
        ],
        "status": [
            {"label": "System Ready", "value": "Online"},
            {"label": "Detection Engine", "value": "Active"},
            {"label": "Model Status", "value": "Loaded"},
            {"label": "Camera Feed", "value": "Simulated"},
        ],
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_shelf(
    reference_image: UploadFile = File(...),
    current_image: UploadFile = File(...),
):
    if not reference_image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Reference image must be a valid image file")
    if not current_image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Current image must be a valid image file")

    await reference_image.read()
    await current_image.read()

    return {
        "success": True,
        "analysisId": "analysis_001",
        "processedAt": datetime.utcnow().isoformat() + "Z",
    }


@app.get("/api/results", response_model=ResultsResponse)
async def get_results():
    return {
        "productsDetected": 1278,
        "misplacedCount": 3,
        "missingCount": 3,
        "shelfHealth": 86,
        "healthy": 72,
        "rearrangement": 18,
        "misplaced": [
            "Cereal bars on snack aisle",
            "Soda bottles misaligned",
            "Energy drinks behind labels",
        ],
        "missing": [
            "Organic almond milk",
            "Signature chips",
            "Sparkling water",
        ],
        "misplacedDetails": [
            {
                "name": "Cereal bars",
                "rowNumber": "Row 2",
                "productNumber": 12,
                "expectedProduct": "Granola bars",
            },
            {
                "name": "Soda bottles",
                "rowNumber": "Row 4",
                "productNumber": 8,
                "expectedProduct": "Sparkling water",
            },
            {
                "name": "Energy drinks",
                "rowNumber": "Row 3",
                "productNumber": 5,
                "expectedProduct": "Sports drinks",
            },
        ],
        "missingDetails": [
            {"name": "Organic almond milk", "missingCount": 2},
            {"name": "Signature chips", "missingCount": 1},
            {"name": "Sparkling water", "missingCount": 4},
        ],
        "confidence": 93,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=60",
    }

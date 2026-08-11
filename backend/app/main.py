# Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement.
from datetime import datetime
from typing import List, Optional
import subprocess
import sys
import json
from pathlib import Path

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


# Path to the misplaced detector folder
BASE_DIR = Path(__file__).resolve().parent
# backend/app -> backend -> repo root
REPO_ROOT = BASE_DIR.parent.parent
DETECTOR_DIR = REPO_ROOT / "misplaced_detector"
COMPARISON_JSON = DETECTOR_DIR / "outputs" / "comparison.json"
CURRENT_SLOTS_JSON = DETECTOR_DIR / "outputs" / "current_slots.json"
REFERENCE_JSON = DETECTOR_DIR / "outputs" / "reference.json"

def build_results_from_detector():
    """Read detector outputs and build the API results payload."""
    if not COMPARISON_JSON.exists():
        return None

    try:
        comp = json.loads(COMPARISON_JSON.read_text())
    except Exception:
        return None

    # try to read current slots for productsDetected
    products_detected = None
    if CURRENT_SLOTS_JSON.exists():
        try:
            cur = json.loads(CURRENT_SLOTS_JSON.read_text())
            products_detected = cur.get("total_slots")
        except Exception:
            products_detected = None

    summary = comp.get("summary", {})
    total = sum(summary.get(k, 0) for k in ("correct", "missing", "misplaced", "unexpected_product")) or 1
    correct = summary.get("correct", 0)
    shelf_health = int((correct / total) * 100)

    misplaced_details = []
    missing_counts = {}
    misplaced_list = []
    missing_list = []

    for r in comp.get("results", []):
        status = r.get("status")
        if status == "misplaced":
            misplaced_details.append(
                {
                    "name": r.get("detected"),
                    "rowNumber": f"Row {r.get('row')}",
                    "productNumber": r.get("position"),
                    "expectedProduct": r.get("expected"),
                }
            )
            misplaced_list.append(r.get("detected"))
        elif status == "missing":
            expected = r.get("expected")
            missing_counts[expected] = missing_counts.get(expected, 0) + 1
            missing_list.append(expected)

    missing_details = [{"name": k, "missingCount": v} for k, v in missing_counts.items()]

    results = {
        "productsDetected": products_detected or summary.get("correct", 0) + summary.get("misplaced", 0) + summary.get("missing", 0),
        "misplacedCount": summary.get("misplaced", 0),
        "missingCount": summary.get("missing", 0),
        "shelfHealth": shelf_health,
        "healthy": correct,
        "rearrangement": summary.get("misplaced", 0),
        "misplaced": misplaced_list,
        "missing": missing_list,
        "misplacedDetails": misplaced_details,
        "missingDetails": missing_details,
        "confidence": 90,
        "image": None,
    }

    # optional: attach reference/current image paths if available
    try:
        if REFERENCE_JSON.exists():
            ref = json.loads(REFERENCE_JSON.read_text())
            results["reference"] = ref.get("image")
    except Exception:
        pass

    return results


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
    image: Optional[str] = None


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

    # save uploaded files to the detector input folder
    try:
        detector_input = DETECTOR_DIR / "input"
        detector_input.mkdir(parents=True, exist_ok=True)

        ref_path = detector_input / "reference.jpg"
        cur_path = detector_input / "current.jpg"

        with open(ref_path, "wb") as f:
            f.write(await reference_image.read())

        with open(cur_path, "wb") as f:
            f.write(await current_image.read())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded images: {exc}")

    # run the existing detector script (synchronous)
    try:
        subprocess.run([sys.executable, str(DETECTOR_DIR / "main.py")], cwd=str(DETECTOR_DIR), check=True)
    except subprocess.CalledProcessError as exc:
        raise HTTPException(status_code=500, detail=f"Detector failed: {exc}")

    # build results from detector outputs
    detector_results = build_results_from_detector()

    if detector_results:
        # persist detector results to a file the API can serve (optional)
        try:
            out_path = DETECTOR_DIR / "outputs" / "api_results.json"
            out_path.write_text(json.dumps(detector_results))
        except Exception:
            pass

    return {
        "success": True,
        "analysisId": "analysis_001",
        "processedAt": datetime.utcnow().isoformat() + "Z",
        "results": detector_results,
    }


@app.get("/api/results", response_model=ResultsResponse)
async def get_results():
    # try to serve latest detector-derived results first
    api_results_path = DETECTOR_DIR / "outputs" / "api_results.json"
    if api_results_path.exists():
        try:
            return json.loads(api_results_path.read_text())
        except Exception:
            pass

    detector_built = build_results_from_detector()
    if detector_built:
        return detector_built

    # fallback mock data
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

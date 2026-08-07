from pathlib import Path

# =========================
# Project Paths
# =========================

PROJECT_ROOT = Path(__file__).resolve().parent

WEIGHTS_DIR = PROJECT_ROOT / "weights"
OUTPUT_DIR = PROJECT_ROOT / "outputs"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# =========================
# Model Weights
# =========================

YOLO_WEIGHTS = WEIGHTS_DIR / "best.pt"
CLASSIFIER_WEIGHTS = WEIGHTS_DIR / "best_model.pth"

# =========================
# Detection Parameters
# =========================

YOLO_IMAGE_SIZE = 640
YOLO_CONFIDENCE = 0.25

# =========================
# Classification Parameters
# =========================

CLASSIFICATION_IMAGE_SIZE = 224

# =========================
# Matching Parameters
# =========================

DISTANCE_THRESHOLD = 60

# =========================
# Output Files
# =========================

REFERENCE_JSON = OUTPUT_DIR / "reference.json"
CURRENT_JSON = OUTPUT_DIR / "current_slots.json"
COMPARISON_JSON = OUTPUT_DIR / "comparison.json"
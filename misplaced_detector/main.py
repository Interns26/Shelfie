import json
import os
from pathlib import Path


def ensure_ultralytics_settings():
    appdata = os.getenv("APPDATA")
    if not appdata:
        return

    ul_dir = Path(appdata) / "Ultralytics"
    ul_dir.mkdir(parents=True, exist_ok=True)

    settings_path = ul_dir / "settings.json"
    default_settings = {
        "runs_dir": str(Path(__file__).resolve().parent.parent / "ultralytics_runs")
    }

    if settings_path.exists():
        try:
            json.loads(settings_path.read_text(encoding="utf-8"))
            return
        except Exception:
            pass

    settings_path.write_text(json.dumps(default_settings, indent=2), encoding="utf-8")
    print(f"Created Ultralytics settings at {settings_path}")


ensure_ultralytics_settings()

from pipeline.reference import ReferenceBuilder
from pipeline.current import CurrentBuilder
from pipeline.comparison import ComparisonEngine
from config import COMPARISON_JSON
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

reference_path = BASE_DIR / "input" / "reference.jpg"
current_path = BASE_DIR / "input" / "current.jpg"

reference = ReferenceBuilder().build(str(reference_path))
current = CurrentBuilder().build(str(current_path))

engine = ComparisonEngine()

comparison = engine.compare(reference, current)

engine.save(comparison, str(COMPARISON_JSON))

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

import os
from pathlib import Path

from inference_sdk import InferenceConfiguration, InferenceHTTPClient


WORKSPACE_NAME = "esha-mubashir-uworx-co-uk"
WORKFLOW_ID = "shelfie-detergentt-vshelfie-detergentt-3-yolo26s-t1-logic"
DEFAULT_CONFIDENCE_THRESHOLD = 0.50


def run_detergent_workflow(image_path):
    """Run the deployed detergent workflow for one local image."""
    api_key = os.getenv("ROBOFLOW_API_KEY")
    if not api_key:
        raise RuntimeError("ROBOFLOW_API_KEY is not set")

    image = Path(image_path)
    if not image.is_file():
        raise FileNotFoundError(f"Image not found: {image}")

    client = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key=api_key,
    ).configure(
        InferenceConfiguration(api_key_transport="header")
    )

    return client.run_workflow(
        workspace_name=WORKSPACE_NAME,
        workflow_id=WORKFLOW_ID,
        images={"image": str(image)},
        use_cache=False,
    )


def normalize_predictions(workflow_result, confidence_threshold=DEFAULT_CONFIDENCE_THRESHOLD):
    """Convert Roboflow workflow output into Shelfie's product format."""
    if not workflow_result:
        return []

    output = workflow_result[0] if isinstance(workflow_result, list) else workflow_result
    predictions = output.get("predictions", {}).get("predictions", [])
    normalized = []

    for prediction in predictions:
        confidence = float(prediction.get("confidence", 0))
        product_name = prediction.get("class")
        if confidence < confidence_threshold or not product_name:
            continue

        center_x = float(prediction["x"])
        center_y = float(prediction["y"])
        width = float(prediction["width"])
        height = float(prediction["height"])
        x1 = int(round(center_x - width / 2))
        y1 = int(round(center_y - height / 2))
        x2 = int(round(center_x + width / 2))
        y2 = int(round(center_y + height / 2))

        normalized.append(
            {
                "product_name": product_name,
                "class_id": prediction.get("class_id"),
                "detection_confidence": confidence,
                "bbox": [x1, y1, x2, y2],
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
                "center_x": center_x,
                "center_y": center_y,
            }
        )

    return normalized

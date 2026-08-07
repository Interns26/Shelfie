from ultralytics import YOLO

from config import (
    YOLO_WEIGHTS,
    YOLO_CONFIDENCE,
    YOLO_IMAGE_SIZE
)


class ProductDetector:

    def __init__(self):

        self.model = YOLO(str(YOLO_WEIGHTS))

    def predict(self, image):

        """
        Returns the raw Ultralytics Result object.
        """

        results = self.model.predict(

            source=image,

            imgsz=YOLO_IMAGE_SIZE,

            conf=YOLO_CONFIDENCE,

            save=False,

            verbose=False

        )

        return results[0]

    def detect(self, image):

        """
        Returns detections as dictionaries.
        """

        result = self.predict(image)

        detections = []

        for box in result.boxes:

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({

                "class_id":
                    int(box.cls[0]),

                "class_name":
                    self.model.names[
                        int(box.cls[0])
                    ],

                "confidence":
                    float(box.conf[0]),

                "x1": int(x1),

                "y1": int(y1),

                "x2": int(x2),

                "y2": int(y2),

                "width": int(x2 - x1),

                "height": int(y2 - y1),

                "center_x": float((x1 + x2) / 2),

                "center_y": float((y1 + y2) / 2)

            })

        return detections

    def crop_products(self, image):

        """
        Returns list of cropped products together with
        their metadata.
        """

        import cv2

        detections = self.detect(image)

        if isinstance(image, str):
            image = cv2.imread(image)

        crops = []

        for det in detections:

            crop = image[
                det["y1"]:det["y2"],
                det["x1"]:det["x2"]
            ]

            crops.append({

                "crop": crop,

                "bbox": [
                    det["x1"],
                    det["y1"],
                    det["x2"],
                    det["y2"]
                ],

                "center_x": det["center_x"],

                "center_y": det["center_y"],

                "confidence": det["confidence"]

            })

        return crops
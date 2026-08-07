from models.detector import ProductDetector
from models.classifier import Classifier

class ProductExtractor:

    def __init__(self):

        self.detector = ProductDetector()
        self.classifier = Classifier()

    def compute_iou(self, box1, box2):

        x1 = max(box1[0], box2[0])
        y1 = max(box1[1], box2[1])
        x2 = min(box1[2], box2[2])
        y2 = min(box1[3], box2[3])

        inter_w = max(0, x2 - x1)
        inter_h = max(0, y2 - y1)

        inter = inter_w * inter_h

        area1 = (box1[2]-box1[0]) * (box1[3]-box1[1])
        area2 = (box2[2]-box2[0]) * (box2[3]-box2[1])

        union = area1 + area2 - inter

        if union == 0:
            return 0

        return inter / union

    def remove_duplicate_slots(self, detections, iou_threshold=0.7):

        detections = sorted(
            detections,
            key=lambda x: x["confidence"],
            reverse=True
        )

        keep = []

        while detections:

            best = detections.pop(0)
            keep.append(best)

            remaining = []

            for det in detections:

                iou = self.compute_iou(best["bbox"], det["bbox"])

                if iou < iou_threshold:
                    remaining.append(det)

            detections = remaining

        return keep

    def extract_products(self, image):

        detections = self.detector.crop_products(image)

        # Remove duplicate detections before classification
        detections = self.remove_duplicate_slots(detections)

        products = []

        for det in detections:

            prediction = self.classifier.predict(det["crop"])

            products.append({

                "product_name":
                    prediction["product_name"],

                "class_id":
                    prediction["class_id"],

                "classification_confidence":
                    prediction["confidence"],

                "detection_confidence":
                    det["confidence"],

                "bbox":
                    det["bbox"],

                "x1":
                    det["bbox"][0],

                "y1":
                    det["bbox"][1],

                "x2":
                    det["bbox"][2],

                "y2":
                    det["bbox"][3],

                "center_x":
                    det["center_x"],

                "center_y":
                    det["center_y"]

            })

        return products
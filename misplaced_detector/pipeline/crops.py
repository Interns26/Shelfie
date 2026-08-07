from models.detector import ProductDetector
from models.classifier import Classifier


class ProductExtractor:

    def __init__(self):

        self.detector = ProductDetector()
        self.classifier = Classifier()

    def extract_products(self, image):

        """
        Detect products using YOLO and classify each crop.

        Returns:
            List[dict]
        """

        detections = self.detector.crop_products(image)

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
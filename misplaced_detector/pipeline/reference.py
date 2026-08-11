# Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement.
import json

from config import REFERENCE_JSON

from pipeline.crops import ProductExtractor
from pipeline.rows import process_rows


class ReferenceBuilder:

    def __init__(self):

        self.extractor = ProductExtractor()

    def build(self, image_path):

        # ----------------------------------
        # Detection + Classification
        # ----------------------------------

        detections = self.extractor.extract_products(image_path)

        # ----------------------------------
        # Geometry
        # ----------------------------------

        for obj in detections:

            x1 = obj["x1"]
            y1 = obj["y1"]
            x2 = obj["x2"]
            y2 = obj["y2"]

            obj["width"] = x2 - x1
            obj["height"] = y2 - y1

            obj["bottom"] = y2

            obj["bbox"] = [
                x1,
                y1,
                x2,
                y2
            ]

            obj["center"] = [
                obj["center_x"],
                obj["center_y"]
            ]

            obj["type"] = "product"

        # ----------------------------------
        # Row Assignment
        # ----------------------------------

        rows = process_rows(detections)

        # ----------------------------------
        # Build Slots
        # ----------------------------------

        slots = []

        slot_id = 1

        for row in rows:

            for obj in row["objects"]:

                slot = {

                    "slot_id": slot_id,

                    "row": obj["row"],

                    "position": obj["position"],

                    "center": [

                        obj["center_x"],

                        obj["center_y"]

                    ],

                    "bbox": obj["bbox"],

                    "expected_type": obj["type"]

                }

                if obj["type"] == "product":

                    slot["expected_product"] = obj["product_name"]

                else:

                    slot["expected_product"] = None

                slots.append(slot)

                slot_id += 1

        reference_json = {

            "image": image_path,

            "total_slots": len(slots),

            "slots": slots

        }

        with open(REFERENCE_JSON, "w") as f:

            json.dump(

                reference_json,

                f,

                indent=4

            )

        return reference_json
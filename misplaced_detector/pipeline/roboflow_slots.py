import json

from pipeline.rows import process_rows


def build_slot_map(detections, image_path, output_path, reference=False):
    """Build a Shelfie slot map from normalized Roboflow detections."""
    products = []
    for detection in detections:
        item = dict(detection)
        item["width"] = item["x2"] - item["x1"]
        item["height"] = item["y2"] - item["y1"]
        item["bottom"] = item["y2"]
        item["center"] = [item["center_x"], item["center_y"]]
        products.append(item)

    rows = process_rows(products)
    slots = []
    slot_id = 1

    for row in rows:
        for product in row["objects"]:
            slot = {
                "slot_id": slot_id,
                "row": product["row"],
                "position": product["position"],
                "center": product["center"],
                "bbox": product["bbox"],
            }
            if reference:
                slot["expected_type"] = "product"
                slot["expected_product"] = product["product_name"]
            else:
                slot["product"] = product["product_name"]
            slots.append(slot)
            slot_id += 1

    result = {
        "image": str(image_path),
        "total_slots": len(slots),
        "slots": slots,
    }
    with open(output_path, "w") as output_file:
        json.dump(result, output_file, indent=4)
    return result

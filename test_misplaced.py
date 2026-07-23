import cv2
import json
import os
from similarity_check import calculate_similarity

# ============================================================
# Configuration
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

IMAGE_NAME = "022"

IMAGE_PATH = os.path.join(BASE_DIR, "images", IMAGE_NAME + ".jpg")
ANNOTATION_PATH = os.path.join(BASE_DIR, "annotations", IMAGE_NAME + ".jpg.json")

OUTPUT_PATH = os.path.join(BASE_DIR, "results", IMAGE_NAME + "_misplaced.jpg")
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# Ignore tiny boxes
MIN_BOX_AREA = 20000

# Products whose y-centers differ by less than this
# are assumed to belong to the same shelf row.
ROW_THRESHOLD = 80

SIMILARITY_THRESHOLD = 0.50


# ============================================================
# Placeholder functions
# Replace with your own implementation
# ============================================================

def get_embedding(image):
    """
    Replace with your own embedding function.
    """
    pass


def similarity(embedding1, embedding2):
    """
    Replace with your similarity function.

    Returns a float between 0 and 1.
    """
    pass


# ============================================================
# Load
# ============================================================

image = cv2.imread(IMAGE_PATH)

with open(ANNOTATION_PATH) as f:
    data = json.load(f)


# ============================================================
# Extract products only
# ============================================================

products = []

for obj in data["objects"]:

    if obj["classTitle"] != "Product":
        continue

    if obj["geometryType"] != "rectangle":
        continue

    (x1, y1), (x2, y2) = obj["points"]["exterior"]

    x1 = int(x1)
    y1 = int(y1)
    x2 = int(x2)
    y2 = int(y2)

    area = (x2 - x1) * (y2 - y1)

    if area < MIN_BOX_AREA:
        continue

    crop = image[y1:y2, x1:x2]

    products.append({
        "bbox": (x1, y1, x2, y2),
        "crop": crop,
        "cx": (x1 + x2) / 2,
        "cy": (y1 + y2) / 2,
        "status": "Correct"
    })


# ============================================================
# Group into shelf rows
# ============================================================

products.sort(key=lambda p: p["cy"])

rows = []

for product in products:

    assigned = False

    for row in rows:

        if abs(product["cy"] - row[0]["cy"]) < ROW_THRESHOLD:
            row.append(product)
            assigned = True
            break

    if not assigned:
        rows.append([product])


# ============================================================
# Sort each row from left to right
# ============================================================

for row in rows:
    row.sort(key=lambda p: p["cx"])


# ============================================================
# Compare neighbours
# ============================================================

for row in rows:

    # embeddings = []

    # for product in row:
    #     emb = get_embedding(product["crop"])
    #     embeddings.append(emb)

    for i in range(len(row)):

        left_similarity = None
        right_similarity = None

        if i > 0:
            # left_similarity = similarity(
            #     embeddings[i],
            #     embeddings[i - 1]
            # )
            left_similarity = calculate_similarity(row[i]["crop"], row[i - 1]["crop"])

        if i < len(row) - 1:
            # right_similarity = similarity(
            #     embeddings[i],
            #     embeddings[i + 1]
            # )
            right_similarity = calculate_similarity(row[i]["crop"], row[i + 1]["crop"])

        neighbours = []

        if left_similarity is not None:
            neighbours.append(left_similarity)

        if right_similarity is not None:
            neighbours.append(right_similarity)

        if len(neighbours) == 0:
            continue

        if max(neighbours) < SIMILARITY_THRESHOLD:
            row[i]["status"] = "Misplaced"


# ============================================================
# Draw results
# ============================================================

output = image.copy()

for product in products:

    x1, y1, x2, y2 = product["bbox"]

    if product["status"] == "Misplaced":

        color = (0, 0, 255)
        label = "Misplaced"

    else:

        color = (0, 255, 0)
        label = "Correctly Placed"

    cv2.rectangle(
        output,
        (x1, y1),
        (x2, y2),
        color,
        3
    )

    cv2.putText(
        output,
        label,
        (x1, y1 - 8),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        color,
        2
    )

cv2.imwrite(OUTPUT_PATH, output)

print("Saved:", OUTPUT_PATH)
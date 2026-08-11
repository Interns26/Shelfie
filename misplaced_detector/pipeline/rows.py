# Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement.
from copy import deepcopy


def assign_rows(detections, threshold=25):
    """
    Groups detections into shelf rows using the bottom y-coordinate.
    """

    detections = sorted(
        deepcopy(detections),
        key=lambda d: d["bottom"]
    )

    rows = []

    for det in detections:

        assigned = False

        for row in rows:

            if abs(det["bottom"] - row["bottom"]) < threshold:

                row["objects"].append(det)

                row["bottom"] = (
                    row["bottom"] +
                    det["bottom"]
                ) / 2

                assigned = True
                break

        if not assigned:

            rows.append({

                "bottom": det["bottom"],

                "objects": [det]

            })

    return rows


def assign_positions(rows):
    """
    Sort products inside each row from left to right
    and assign row number and position.
    """

    for row_number, row in enumerate(rows, start=1):

        row["objects"] = sorted(

            row["objects"],

            key=lambda d: d["center_x"]

        )

        for position, obj in enumerate(

            row["objects"],

            start=1

        ):

            obj["row"] = row_number

            obj["position"] = position

    return rows


def flatten_rows(rows):
    """
    Converts rows back into a flat list while
    preserving row/position.
    """

    detections = []

    for row in rows:

        detections.extend(row["objects"])

    return detections


def process_rows(detections, threshold=25):
    """
    Complete row processing pipeline.
    """

    rows = assign_rows(
        detections,
        threshold
    )

    rows = assign_positions(rows)

    return rows
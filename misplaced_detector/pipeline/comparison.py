# Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement.
import json
import numpy as np
from scipy.optimize import linear_sum_assignment


class ComparisonEngine:

    def load_reference(self, path):
        with open(path) as f:
            return json.load(f)


    def load_current(self, path):
        with open(path) as f:
            return json.load(f)


    def assign_slots(self, reference, current):

        reference_slots = reference["slots"]
        current_slots = current["slots"]

        N = len(reference_slots)
        M = len(current_slots)

        cost_matrix = np.zeros((N, M), dtype=np.float32)

        ROW_PENALTY = 80
        DISTANCE_WEIGHT = 1.0
        SIZE_WEIGHT = 0.001


        for i, ref in enumerate(reference_slots):

            rx, ry = ref["center"]

            rw = ref["bbox"][2] - ref["bbox"][0]
            rh = ref["bbox"][3] - ref["bbox"][1]
            rarea = rw * rh


            for j, cur in enumerate(current_slots):

                cx, cy = cur["center"]

                cw = cur["bbox"][2] - cur["bbox"][0]
                ch = cur["bbox"][3] - cur["bbox"][1]
                carea = cw * ch


                distance = np.sqrt(
                    (rx-cx)**2 +
                    (ry-cy)**2
                )


                row_penalty = 0

                if ref["row"] != cur["row"]:
                    row_penalty = ROW_PENALTY


                size_penalty = abs(
                    rarea-carea
                ) * SIZE_WEIGHT


                cost_matrix[i,j] = (
                    DISTANCE_WEIGHT * distance
                    +
                    row_penalty
                    +
                    size_penalty
                )


        ref_idx, cur_idx = linear_sum_assignment(cost_matrix)


        assignments = []

        matched_reference = set()
        matched_current = set()


        costs = [
            cost_matrix[r,c]
            for r,c in zip(ref_idx,cur_idx)
        ]

        MAX_COST = np.percentile(costs,95)


        for r,c in zip(ref_idx,cur_idx):

            cost = cost_matrix[r,c]


            if cost > MAX_COST:
                continue


            matched_reference.add(r)
            matched_current.add(c)


            assignments.append({

                "reference": reference_slots[r],

                "current": current_slots[c],

                "cost": float(cost)

            })


        for i,ref in enumerate(reference_slots):

            if i not in matched_reference:

                assignments.append({

                    "reference": ref,

                    "current": None

                })


        for i,cur in enumerate(current_slots):

            if i not in matched_current:

                assignments.append({

                    "reference": None,

                    "current": cur

                })


        return assignments
    def compare(self, reference, current):

        assignments = self.assign_slots(reference, current)

        results = []

        summary = {

            "correct":0,
            "missing":0,
            "misplaced":0,
            "unexpected_product":0

        }

        for pair in assignments:

            ref = pair["reference"]
            cur = pair["current"]


            # Missing product
            if ref is not None and cur is None:

                summary["missing"] += 1

                results.append({

                    "slot_id": ref["slot_id"],
                    "expected": ref["expected_product"],
                    "status": "missing"

                })

                continue


            # Unexpected product
            if ref is None and cur is not None:

                summary["unexpected_product"] += 1

                results.append({

                    "detected": cur["product"],
                    "current_row": cur["row"],
                    "current_position": cur["position"],
                    "status": "unexpected_product"

                })

                continue


            # Normal matched case
            if ref["expected_product"] == cur["product"]:

                status = "correct"
                summary["correct"] += 1

            else:

                status = "misplaced"
                summary["misplaced"] += 1


            results.append({

                "slot_id": ref["slot_id"],

                "row": ref["row"],

                "position": ref["position"],

                "expected": ref["expected_product"],

                "detected": cur["product"],

                "status": status

            })
        return {

            "summary": summary,

            "results": results

        }
    def save(self, comparison, path):

        with open(path,"w") as f:

            json.dump(comparison, f, indent=4)
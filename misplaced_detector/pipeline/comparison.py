import json

class ComparisonEngine:

    def load_reference(self, path):

        with open(path) as f:
            return json.load(f)

    def load_current(self, path):

        with open(path) as f:
            return json.load(f)
    def assign_slots(self, reference, current):

        assigned = []

        used = set()

        for slot in reference["slots"]:

            best = None
            best_distance = 1e9

            sx, sy = slot["center"]

            for i, product in enumerate(current["slots"]):

                if i in used:
                    continue

                px, py = product["center"]

                distance = ((sx-px)**2 + (sy-py)**2)**0.5

                if distance < best_distance:

                    best_distance = distance
                    best = i

            if best is not None:

                used.add(best)

                assigned.append({

                    "reference": slot,

                    "current": current["slots"][best]

                })

            else:

                assigned.append({

                    "reference": slot,

                    "current": None

                })

        return assigned
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

            if cur is None:

                summary["missing"] += 1

                results.append({

                    "slot_id": ref["slot_id"],

                    "status":"missing"

                })

                continue

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
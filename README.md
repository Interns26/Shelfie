<!-- Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. -->
# Retail-Computer-Vision

# Shelfie

**AI eyes for every shelf.**

Shelfie is a retail shelf intelligence system that turns a shelf photo into an instant, actionable report of what's missing, what's misplaced, and where — no manual audits required.

---

## The Problem

Retail shelves quietly lose money in two ways:

- **Out-of-stocks** — a product sells out and nobody notices until a customer complains or a manual audit catches it, hours or days later.
- **Planogram non-compliance** — products end up in the wrong slot, breaking supplier agreements, hurting discoverability, and making the shelf harder to shop.

Manual shelf audits are slow, infrequent, and inconsistent — a human can't check every aisle every hour. Studies commonly attribute 4–8% of retail revenue loss to on-shelf unavailability alone.

## The Solution

Shelfie compares a **reference image** (how the shelf *should* look, i.e. the planogram) against a **current image** (how the shelf actually looks right now) and automatically flags every discrepancy — down to the exact row and position, and what product *should* be there instead.

The result is a live dashboard showing:
- **Products detected** on the shelf
- **Misplaced products** — with row, position, and expected product
- **Missing products** — with counts
- **Shelf health score** — a single number summarizing planogram compliance

---

## How It Works

```
 ┌──────────────┐        ┌──────────────┐        ┌───────────────────┐
 │   Reference   │        │   Current     │        │                    │
 │  shelf image  │        │  shelf image  │        │   React Dashboard  │
 │  (planogram)  │        │  (live camera)│        │                    │
 └──────┬────────┘        └──────┬────────┘        └─────────▲──────────┘
        │                        │                            │
        └───────────┬────────────┘                            │
                     ▼                                         │
            ┌─────────────────────┐                            │
            │   FastAPI backend    │───────────────────────────┘
            │  /api/analyze         │        JSON results
            │  /api/results          │
            └──────────┬────────────┘
                        ▼
        ┌───────────────────────────────────┐
        │      misplaced_detector pipeline      │
        │                                        │
        │  1. YOLO product detector              │
        │     → locates every product on shelf   │
        │  2. Image classifier                    │
        │     → names each detected product       │
        │  3. Row/slot builder                     │
        │     → maps detections into shelf rows    │
        │  4. Comparison engine                     │
        │     → matches reference vs current slots  │
        │       → correct / missing / misplaced      │
        └────────────────────────────────────────────┘
```

1. Two images are uploaded through the dashboard — a reference (planogram) shelf image and a current (live) shelf image.
2. The **YOLO detector** locates every product on both shelves and crops them out.
3. The **classifier** identifies what each cropped product actually is.
4. Detected products are grouped into **rows and left-to-right positions**, building a structured "slot map" for both images.
5. The **comparison engine** matches each reference slot to the corresponding current slot and labels it `correct`, `missing`, `misplaced`, or `unexpected_product`.
6. The FastAPI backend turns this into a clean JSON response; the dashboard renders it as stat cards and a detailed findings list.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Axios |
| Backend | FastAPI, Uvicorn |
| Detection | YOLO (Ultralytics), trained on a grocery-shelf dataset |
| Classification | Custom-trained image classifier (PyTorch) |
| Vision utilities | OpenCV |

---

## Project Structure

```
Shelfie/
├── src/                          # React dashboard
│   ├── pages/Dashboard/          # main dashboard page
│   ├── components/               # UI components (stat cards, upload dropzone, product lists...)
│   └── services/api/             # API client — talks to the FastAPI backend
│
├── backend/
│   ├── app/main.py               # FastAPI app — /api/dashboard, /api/analyze, /api/results
│   └── requirements.txt
│
└── misplaced_detector/           # computer vision pipeline
    ├── models/
    │   ├── detector.py           # YOLO product detector
    │   └── classifier.py         # product classifier
    ├── pipeline/
    │   ├── reference.py          # builds slot map from the reference image
    │   ├── current.py            # builds slot map from the current image
    │   ├── crops.py              # detection + classification combined
    │   ├── rows.py               # groups detections into shelf rows
    │   └── comparison.py         # compares reference vs current, flags issues
    └── weights/                  # trained model weights (best.pt, best_model.pth)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Frontend

```bash
npm install
npm run dev
```

Runs the dashboard locally via Vite (default: `http://localhost:5173`).

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Summary overview stats |
| `POST` | `/api/analyze` | Accepts `reference_image` + `current_image`, runs the CV pipeline |
| `GET` | `/api/results` | Detailed misplaced/missing product breakdown for the latest analysis |

---

## Roadmap

- [ ] Live camera feed ingestion (instead of manual image upload)
- [ ] Low-stock / restock notifications
- [ ] Historical shelf-health trends over time
- [ ] Multi-shelf / multi-store dashboard view
- [ ] Confidence scoring surfaced per detection

---

## Business Value

- **Recover lost sales** by catching out-of-stocks before they cost a sale, not after.
- **Cut manual audit time** — staff spend less time walking aisles, more time restocking.
- **Enforce planogram compliance** automatically, protecting supplier and brand agreements.
- **Turn merchandising into a data problem** — shelf health becomes a trackable, objective metric instead of a gut feeling.

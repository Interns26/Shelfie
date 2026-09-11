> **Proprietary & Confidential — UWorx Services 2026**  
> Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement.

# Shelfie

Shelfie is a retail shelf-intelligence dashboard. It compares a correctly arranged reference shelf image with a current shelf image and reports products that are correct, missing, misplaced, or unexpected.

The current real-data workflow is trained for four detergent classes:

```text
bonus
bonus_active
brite
express
```

## Current Workflow

```text
React dashboard
    -> FastAPI /api/analyze
    -> save uploaded reference and current images
    -> Roboflow V3 detergent workflow
    -> confidence filtering and box conversion
    -> row and left-to-right position assignment
    -> reference/current slot comparison
    -> JSON result
    -> dashboard cards and findings
```

The reference image represents how the shelf should look. The current image represents the shelf that needs to be checked.

## What the System Reports

- **Correct**: the detected product matches the reference product at the matched slot.
- **Missing**: a reference slot has no matched current detection.
- **Misplaced**: a current product is matched to a reference slot, but its product class is different.
- **Unexpected product**: a current detection cannot be matched to a reference slot.

The dashboard displays product counts, misplaced-product details, missing-product details, and a shelf-health percentage.

## Real Detergent Dataset

The dataset was created in Roboflow as a private object-detection project.

It contains:

- Individual detergent product images for learning product appearance.
- Full-shelf images for learning crowded shelf conditions.
- Separate annotations for every visible product package.
- YOLO-format image labels.
- Train, validation, and test splits.

The downloaded dataset is stored locally in `detergent_dataset/` and contains `train/`, `valid/`, `test/`, and `data.yaml`.

The four class names are defined in the dataset configuration:

```yaml
names: ['bonus', 'bonus_active', 'brite', 'express']
```

When annotating multiple packages of the same product, draw one box per package. Do not draw one large box around several products because the system needs to count and position each package separately.

## Roboflow Model

The current integration uses the deployed Roboflow V3 workflow:

```text
shelfie-detergentt-vshelfie-detergentt-3-yolo26s-t1-logic
```

The model was tested on full-shelf images and detected separate `brite`, `express`, `bonus`, and `bonus_active` products.

Reported Roboflow test metrics for the V3 model were approximately:

```text
mAP@50: 87.6%
Precision: 95.0%
Recall: 88.5%
F1: 91.5%
```

These metrics measure the detector on Roboflow's test set. They do not by themselves prove that final missing/misplaced decisions are correct. End-to-end accuracy must also be checked against manually prepared reference/current answers.

## Row and Position Logic

Row and position assignment is implemented in [misplaced_detector/pipeline/rows.py](misplaced_detector/pipeline/rows.py).

Each Roboflow detection has a bounding box and center point. The system uses image coordinates:

- `x` increases from left to right.
- `y` increases from top to bottom.

### How rows are created

1. The bottom edge of every product box is calculated as `y2`.
2. Detections are sorted by this bottom coordinate, from top to bottom.
3. A product joins an existing row when its bottom edge is within 25 pixels of that row's current average bottom edge.
4. Otherwise, a new row is created.
5. Rows are numbered from the top of the image downward.

Therefore, a row is a detected horizontal band, not necessarily a physical shelf. Perspective, tilted products, different package heights, or missed detections can split one physical shelf into multiple calculated rows.

### How positions are created

Inside each calculated row, products are sorted by `center_x` from left to right:

```text
Row 1: Position 1, Position 2, Position 3, ...
Row 2: Position 1, Position 2, Position 3, ...
```

So the calculation is:

- vertical coordinate grouping -> row number
- horizontal coordinate sorting -> product position

## Comparison Logic

Comparison is implemented in [misplaced_detector/pipeline/comparison.py](misplaced_detector/pipeline/comparison.py).

The engine builds a cost for every possible reference/current pair using:

- distance between product centers
- a penalty when row numbers differ
- bounding-box size difference

It uses SciPy's linear assignment algorithm to select a one-to-one matching. After matching, product names are compared.

The current comparison is geometric. It assumes the reference and current images have reasonably similar framing, scale, camera angle, and shelf layout. Large camera changes can cause incorrect row or position matches even when the detector itself is correct.

## Unknown Products

The current model only has four trained classes. If an unseen product such as `rin` appears, the system does not reliably know that it is Rin.

Possible behavior is:

- it is not detected, causing the slot to appear missing;
- it is incorrectly forced into a known class such as `brite` or `bonus`;
- it is detected but cannot be matched and appears as unexpected.

The current system does not yet provide guaranteed open-set recognition. To support additional products reliably, add them to the Roboflow dataset, annotate them, create a new dataset version, retrain, and update the workflow. Unknown-product handling should also be added before production use.

## Project Structure

```text
Shelfie/
├── index.html                         # Browser entry page and initial theme setup
├── package.json                        # Frontend dependencies and npm scripts
├── vite.config.js                     # Vite server and /api proxy configuration
├── tailwind.config.js                 # Tailwind theme and utility configuration
├── postcss.config.js                  # Tailwind/PostCSS build configuration
├── src/
│   ├── main.jsx                       # React startup and BrowserRouter
│   ├── App.jsx                        # App shell, background, and page transitions
│   ├── index.css                      # Global CSS, theme variables, and reusable styles
│   ├── pages/Dashboard/Dashboard.jsx  # Upload flow and result dashboard
│   ├── components/                    # Layout and reusable UI components
│   ├── services/api/index.js          # Axios API calls to FastAPI
│   ├── hooks/UseTheme.js              # Light/dark theme state
│   └── utils/designTokens.js          # Shared visual design values
├── backend/
│   ├── app/main.py                    # FastAPI routes and analysis orchestration
│   ├── app/roboflow_client.py         # Roboflow V3 client and prediction normalization
│   ├── requirements.txt                # Backend and inference dependencies
│   └── scripts/                        # Optional Ultralytics setup helper
├── misplaced_detector/
│   ├── config.py                      # Detector paths and legacy pipeline settings
│   ├── main.py                        # Legacy local detector entry point
│   ├── models/                        # Legacy local YOLO/classifier implementations
│   ├── pipeline/
│   │   ├── rows.py                    # Row grouping and left-to-right positions
│   │   ├── roboflow_slots.py          # Roboflow detections to Shelfie slot maps
│   │   ├── comparison.py              # Reference/current matching and statuses
│   │   ├── reference.py               # Legacy local reference builder
│   │   ├── current.py                 # Legacy local current builder
│   │   └── crops.py                   # Legacy local detector/classifier bridge
│   ├── input/                         # Runtime reference.jpg and current.jpg
│   ├── outputs/                       # Generated JSON results
│   └── weights/                       # Legacy/local model files
└── detergent_dataset/                 # Extracted Roboflow YOLO dataset
```

## Important Files in the Current Flow

### [src/pages/Dashboard/Dashboard.jsx](src/pages/Dashboard/Dashboard.jsx)

- Displays the dashboard.
- Accepts reference and current image uploads.
- Creates browser previews.
- Sends both files to `/api/analyze`.
- Shows loading and error states.
- Displays product counts and detailed findings.

### [src/services/api/index.js](src/services/api/index.js)

- Creates the Axios client.
- Calls `/api/dashboard`.
- Uploads multipart images to `/api/analyze`.
- Retrieves saved results from `/api/results`.

### [backend/app/main.py](backend/app/main.py)

- Validates uploaded image types.
- Saves uploads as `reference.jpg` and `current.jpg`.
- Calls Roboflow for both images.
- Builds reference and current slot maps.
- Runs the comparison engine.
- Converts comparison JSON into the dashboard response.

### [backend/app/roboflow_client.py](backend/app/roboflow_client.py)

- Uses `ROBOFLOW_API_KEY` from the environment.
- Calls the Roboflow V3 workflow.
- Converts Roboflow center/size boxes into corner-coordinate boxes.
- Filters predictions below 50% confidence.

### [misplaced_detector/pipeline/roboflow_slots.py](misplaced_detector/pipeline/roboflow_slots.py)

- Adds geometry fields required by the row algorithm.
- Assigns rows and positions.
- Writes reference and current slot JSON files.

### [misplaced_detector/pipeline/comparison.py](misplaced_detector/pipeline/comparison.py)

- Matches reference slots with current slots.
- Produces `correct`, `missing`, `misplaced`, and `unexpected_product` statuses.

## Generated Output Files

The backend writes these files under `misplaced_detector/outputs/`:

- `reference.json`: expected products and positions from the reference image.
- `current_slots.json`: detected products and positions from the current image.
- `comparison.json`: raw slot-by-slot comparison.
- `api_results.json`: dashboard-friendly result payload.

These files are generated runtime data, not the trained model itself.

## Setup

### Requirements

- Node.js 18 or newer.
- Python 3.12 for the current Roboflow SDK/backend environment.
- A Roboflow account with access to the private detergent workflow.
- A valid Roboflow inference API key.

The old `.venv` may use Python 3.14, which is not compatible with the installed Roboflow SDK. Use `.venv312`.

### Frontend

From the repository root:

```powershell
npm install
npm run dev
```

The Vite development server runs at:

```text
http://localhost:4174
```

The `/api` proxy is configured in [vite.config.js](vite.config.js) to forward requests to port `8001`.

### Backend on Windows PowerShell

From the repository root:

```powershell
.\.venv312\Scripts\Activate.ps1
$env:ROBOFLOW_API_KEY = "YOUR_NEW_ROBOFLOW_KEY"
cd backend
python --version
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

The version check should show Python 3.12.x.

Do not commit or paste the API key into source code. If a key is exposed, revoke it and create a replacement in Roboflow.

### Backend dependencies

```powershell
python -m pip install -r backend\requirements.txt
python -m pip install inference-sdk
```

## Running a Direct Roboflow Test

With `.venv312` active and the key set, run this from the `backend` folder:

```powershell
$python = "C:\Users\EshaMubashirKhan\Shelfie\.venv312\Scripts\python.exe"
& $python -c "from app.roboflow_client import run_detergent_workflow; import json; result=run_detergent_workflow(r'C:\Users\EshaMubashirKhan\Shelfie\misplaced_detector\input\current.jpg'); print(json.dumps(result, indent=2))"
```

A successful response contains separate predictions with classes such as `brite`, `express`, `bonus`, and `bonus_active`.

## Testing the Frontend Flow

1. Start the backend on port `8001`.
2. Start Vite on port `4174`.
3. Open `http://localhost:4174`.
4. Upload a correctly arranged detergent shelf image as the reference.
5. Upload the shelf image to inspect as the current image.
6. Click **Run shelf comparison**.
7. Check the dashboard and, when needed, inspect the generated JSON files.

For a meaningful test, use images with similar camera angle, distance, lighting, and shelf framing. A known test pair should have a manually written expected answer so final comparison accuracy can be measured.

## Accuracy Validation

Roboflow metrics measure detector performance:

- precision: how often detections are correct
- recall: how many real products are found
- mAP: combined detection/class performance
- F1: balance between precision and recall

End-to-end Shelfie accuracy requires additional manual validation:

1. Record the expected products and positions for the reference image.
2. Record the actual products and positions in the current image.
3. Compare the manual answer with the dashboard result.
4. Count missed detections, false detections, wrong classes, wrong rows, wrong positions, and wrong missing/misplaced decisions.

## Known Limitations

- The current model supports only four detergent classes.
- Products outside those classes may be missed or incorrectly assigned a known class.
- Row numbers are calculated horizontal image bands, not guaranteed physical shelf numbers.
- Different camera angles and image scales can reduce comparison accuracy.
- The backend currently uses fixed runtime filenames and is intended for one analysis at a time.
- `/api/dashboard` contains summary/demo values; detailed analysis results come from the latest uploaded comparison.
- The Roboflow cloud workflow requires network access and a valid inference key.
- The current frontend does not provide a complete visual overlay of all comparison statuses.

## Future Improvements

- Add `unknown` or open-set product handling.
- Add more detergent classes such as Rin and retrain the model.
- Improve row grouping using shelf-line detection or perspective correction.
- Use unique analysis IDs and temporary storage for concurrent users.
- Store analysis history in a database.
- Display unexpected products and confidence values in the dashboard.
- Add barcode/OCR support for stronger product identification.
- Add camera capture and live shelf monitoring.
- Add automated ground-truth evaluation and regression tests.

## Business Value

- Detect missing products earlier.
- Reduce manual shelf-audit time.
- Identify planogram and placement problems.
- Turn shelf compliance into measurable data.
- Provide a foundation for future multi-store and multi-category monitoring.

import cv2


def calculate_similarity(image1, image2):
    """
    Calculates similarity between two product images.

    Returns:
        float: Final similarity score (0 to 1+ depending on histogram correlation)
    """

    # -------------------------
    # Read images
    # -------------------------
    # Accept either paths or OpenCV images
    if isinstance(image1, str):
        img1 = cv2.imread(image1)
    else:
        img1 = image1

    if isinstance(image2, str):
        img2 = cv2.imread(image2)
    else:
        img2 = image2

    if img1 is None or img2 is None:
        return 0.0

    # -------------------------
    # Histogram Similarity
    # -------------------------
    hsv1 = cv2.cvtColor(img1, cv2.COLOR_BGR2HSV)
    hsv2 = cv2.cvtColor(img2, cv2.COLOR_BGR2HSV)

    hist1 = cv2.calcHist(
        [hsv1],
        [0, 1],
        None,
        [60, 64],
        [0, 180, 0, 256]
    )

    hist2 = cv2.calcHist(
        [hsv2],
        [0, 1],
        None,
        [60, 64],
        [0, 180, 0, 256]
    )

    cv2.normalize(hist1, hist1)
    cv2.normalize(hist2, hist2)

    histogram_score = cv2.compareHist(
        hist1,
        hist2,
        cv2.HISTCMP_CORREL
    )

    # Histogram correlation can theoretically be in [-1, 1]
    histogram_score = max(0.0, min(histogram_score, 1.0))

    # -------------------------
    # ORB Feature Matching
    # -------------------------
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    orb = cv2.ORB_create(5000)

    kp1, des1 = orb.detectAndCompute(gray1, None)
    kp2, des2 = orb.detectAndCompute(gray2, None)

    if des1 is None or des2 is None:
        return 0.0

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    matches = bf.match(des1, des2)

    if len(matches) == 0:
        return 0.0

    matches = sorted(matches, key=lambda x: x.distance)

    match_count = len(matches)

    average_distance = sum(m.distance for m in matches) / match_count

    orb_score = min(match_count / 300.0, 1.0)

    distance_score = max(0.0, 1.0 - average_distance / 100.0)

    # -------------------------
    # Final Score
    # -------------------------
    final_score = (
        histogram_score * 0.65 +
        orb_score * 0.20 +
        distance_score * 0.15
    )

    return histogram_score




def extract_similarity_features(image):
    """
    Extract the features required for similarity comparison.

    Args:
        image: Image path or OpenCV image.

    Returns:
        dict containing histogram and ORB descriptors.
    """

    # Accept either path or OpenCV image
    if isinstance(image, str):
        img = cv2.imread(image)
    else:
        img = image

    if img is None:
        return None

    # -------------------------
    # Histogram
    # -------------------------
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    hist = cv2.calcHist(
        [hsv],
        [0, 1],
        None,
        [60, 64],
        [0, 180, 0, 256]
    )

    cv2.normalize(hist, hist)

    # -------------------------
    # ORB
    # -------------------------
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    orb = cv2.ORB_create(5000)

    _, descriptors = orb.detectAndCompute(gray, None)

    return {
        "histogram": hist,
        "descriptors": descriptors
    }


def calculate_similarity_from_features(features1, features2):
    """
    Calculate similarity using precomputed features.

    Args:
        features1: Output of extract_similarity_features().
        features2: Output of extract_similarity_features().

    Returns:
        float
    """

    if (
        features1 is None or
        features2 is None or
        features1["descriptors"] is None or
        features2["descriptors"] is None
    ):
        return 0.0

    # -------------------------
    # Histogram Similarity
    # -------------------------
    histogram_score = cv2.compareHist(
        features1["histogram"],
        features2["histogram"],
        cv2.HISTCMP_CORREL
    )

    histogram_score = max(0.0, min(histogram_score, 1.0))

    # -------------------------
    # ORB Matching
    # -------------------------
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    matches = bf.match(
        features1["descriptors"],
        features2["descriptors"]
    )

    if len(matches) == 0:
        return 0.0

    matches = sorted(matches, key=lambda x: x.distance)

    match_count = len(matches)

    average_distance = sum(m.distance for m in matches) / match_count

    orb_score = min(match_count / 300.0, 1.0)

    distance_score = max(0.0, 1.0 - average_distance / 100.0)

    final_score = (
        histogram_score * 0.65 +
        orb_score * 0.20 +
        distance_score * 0.15
    )

    return histogram_score
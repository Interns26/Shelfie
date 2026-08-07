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

    return final_score
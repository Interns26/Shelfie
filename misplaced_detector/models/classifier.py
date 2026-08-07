import numpy as np
from PIL import Image

import torch
import torch.nn as nn
from torchvision import models

import albumentations as A
from albumentations.pytorch import ToTensorV2

import timm

from config import (
    CLASSIFIER_WEIGHTS,
    CLASSIFICATION_IMAGE_SIZE,
)


class Classifier:

    def __init__(self, device=None):

        self.device = (
            device
            if device is not None
            else ("cuda" if torch.cuda.is_available() else "cpu")
        )

        checkpoint = torch.load(
            CLASSIFIER_WEIGHTS,
            map_location=self.device
        )

        self.class_names = checkpoint["class_names"]

        self.model = timm.create_model(
            checkpoint["architecture"],
            pretrained=False,
            num_classes=len(self.class_names),
        )

        self.model.load_state_dict(
            checkpoint["model_state_dict"]
)

        self.model.to(self.device)
        self.model.eval()

        self.softmax = nn.Softmax(dim=1)

        self.transform = A.Compose(
            [
                A.Resize(
                    CLASSIFICATION_IMAGE_SIZE,
                    CLASSIFICATION_IMAGE_SIZE
                ),
                A.Normalize(
                    mean=(0.485, 0.456, 0.406),
                    std=(0.229, 0.224, 0.225),
                ),
                ToTensorV2(),
            ]
        )

    def _prepare(self, image):

        if isinstance(image, str):

            image = np.array(
                Image.open(image).convert("RGB")
            )

        elif isinstance(image, Image.Image):

            image = np.array(image.convert("RGB"))

        elif not isinstance(image, np.ndarray):

            raise ValueError(
                "Input must be image path, PIL image or numpy array."
            )

        image = self.transform(image=image)["image"]

        return image.unsqueeze(0).to(self.device)

    @torch.no_grad()
    def predict(self, image):

        image = self._prepare(image)

        outputs = self.model(image)

        probs = self.softmax(outputs)

        confidence, index = torch.max(probs, dim=1)

        return {
            "product_name": self.class_names[index.item()],
            "confidence": float(confidence.item()),
            "class_id": int(index.item())
        }

    @torch.no_grad()
    def predict_batch(self, images):

        batch = []

        for img in images:
            batch.append(
                self._prepare(img)[0]
            )

        batch = torch.stack(batch).to(self.device)

        outputs = self.model(batch)

        probs = self.softmax(outputs)

        confidence, index = torch.max(probs, dim=1)

        results = []

        for cls, conf in zip(index, confidence):

            results.append({

                "product_name":
                    self.class_names[cls.item()],

                "confidence":
                    float(conf.item()),

                "class_id":
                    int(cls.item())

            })

        return results
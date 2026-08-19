import torch
import numpy as np

from PIL import Image
from transformers import AutoImageProcessor, AutoModel
from sklearn.metrics.pairwise import cosine_similarity


class DINOv2Embedder:
    def __init__(self, model_name="facebook/dinov2-base", device=None):
        """
        Initialize the DINOv2 model.

        Args:
            model_name (str): Hugging Face model name.
            device (str): 'cuda' or 'cpu'. Automatically detected if None.
        """
        self.device = device or (
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"Loading {model_name} on {self.device}...")

        self.processor = AutoImageProcessor.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name).to(self.device)
        self.model.eval()

        print("Model loaded successfully.")

    def get_embedding(self, image_path, normalize=True):
        """
        Generate a DINOv2 embedding.

        Args:
            image_path: Image path (str/Path) or NumPy array.
            normalize: Whether to L2-normalize the embedding.

        Returns:
            np.ndarray: Embedding vector.
        """

        if isinstance(image_path, np.ndarray):
            image = Image.fromarray(image_path).convert("RGB")
        else:
            image = Image.open(image_path).convert("RGB")

        inputs = self.processor(
            images=image,
            return_tensors="pt"
        )

        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)

        embedding = outputs.last_hidden_state[:, 0].cpu().numpy()[0]

        if normalize:
            embedding /= np.linalg.norm(embedding)

        return embedding

    def similarity(self, image1_path, image2_path):
        """
        Compute cosine similarity between two images.

        Returns:
            float
        """
        emb1 = self.get_embedding(image1_path)
        emb2 = self.get_embedding(image2_path)

        return cosine_similarity(
            emb1.reshape(1, -1),
            emb2.reshape(1, -1)
        )[0][0]

    def similarity_from_embeddings(self, emb1, emb2):
        """
        Compute cosine similarity between two embeddings.

        Returns:
            float
        """
        return cosine_similarity(
            emb1.reshape(1, -1),
            emb2.reshape(1, -1)
        )[0][0]

    def batch_embeddings(self, image_paths, normalize=True):
        """
        Compute embeddings for multiple images.

        Args:
            image_paths (list): List of image paths.

        Returns:
            dict: {image_path: embedding}
        """
        embeddings = {}

        for path in image_paths:
            embeddings[path] = self.get_embedding(
                path,
                normalize=normalize
            )

        return embeddings
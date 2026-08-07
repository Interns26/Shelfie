import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
});

const mockDashboard = {
  summary: [
    { title: 'Products Detected', value: '1,278', description: 'Items analyzed in last 24h', icon: 'box' },
    { title: 'Misplaced Products', value: '28', description: 'Detected position errors', icon: 'pin' },
    { title: 'Missing Products', value: '12', description: 'Items needing restock', icon: 'tag' },
    { title: 'Shelf Health', value: '92%', description: 'Optimal display score', icon: 'pulse' },
  ],
  status: [
    { label: 'System Ready', value: 'Online' },
    { label: 'Detection Engine', value: 'Active' },
    { label: 'Model Status', value: 'Loaded' },
    { label: 'Camera Feed', value: 'Simulated' },
  ],
};

const mockMonitoring = {
  shelf: {
    status: 'Waiting',
    confidence: '—',
    lastAnalysis: 'No action taken yet',
    frame: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=60',
  },
};

const mockResults = {
  shelfHealth: 86,
  healthy: 72,
  rearrangement: 18,
  misplaced: ['Cereal bars on snack aisle', 'Soda bottles misaligned', 'Energy drinks behind labels'],
  missing: ['Organic almond milk', 'Signature chips', 'Sparkling water'],
  confidence: 93,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=60',
};

export const fetchDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const analyzeShelf = async (referenceImage, currentImage) => {
  const formData = new FormData();
  formData.append('reference_image', referenceImage);
  formData.append('current_image', currentImage);

  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const fetchResults = async () => {
  const response = await api.get('/results');
  return response.data;
};

export default api;

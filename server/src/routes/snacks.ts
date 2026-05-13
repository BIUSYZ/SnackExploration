import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const router = Router();

// File-based persistence: store snacks in a JSON file so data survives server restarts
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'snacks.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadSnacks(): any[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSnacks(snacks: any[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(snacks, null, 2), 'utf-8');
}

router.get('/', (req, res) => {
  const { filter } = req.query;
  let snacks = loadSnacks();
  
  if (filter === 'red' || filter === 'black') {
    snacks = snacks.filter(s => s.listType === filter);
  }
  
  res.json({ success: true, data: snacks });
});

router.post('/', (req, res) => {
  const { title, imageUrl, listType, rating, description, price, category } = req.body;
  
  if (!title || !imageUrl || !listType || !rating) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const newSnack = {
    id: uuidv4(),
    title,
    imageUrl,
    listType,
    rating: Number(rating),
    description: description || '',
    price: price != null ? Number(price) : null,
    category: category || '',
    createdAt: new Date().toISOString()
  };
  
  const snacks = loadSnacks();
  snacks.unshift(newSnack);
  saveSnacks(snacks);
  
  res.status(201).json({ success: true, data: newSnack });
});

router.get('/:id', (req, res) => {
  const snacks = loadSnacks();
  const snack = snacks.find(s => s.id === req.params.id);
  if (!snack) {
    return res.status(404).json({ success: false, error: 'Snack not found' });
  }
  res.json({ success: true, data: snack });
});

router.delete('/:id', (req, res) => {
  let snacks = loadSnacks();
  const index = snacks.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Snack not found' });
  }
  snacks.splice(index, 1);
  saveSnacks(snacks);
  res.json({ success: true });
});

export default router;

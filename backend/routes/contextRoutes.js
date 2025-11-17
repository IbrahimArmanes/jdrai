import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTEXT_FILE_PATH = path.join(__dirname, '..', 'context.txt');

/**
 * Get context from file
 */
router.get('/context', async (req, res) => {
  try {
    const content = await fs.readFile(CONTEXT_FILE_PATH, 'utf-8');
    res.json({ context: content });
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty
      res.json({ context: '' });
    } else {
      console.error('Error reading context file:', error);
      res.status(500).json({ error: 'Failed to read context file' });
    }
  }
});

/**
 * Save context to file
 */
router.post('/context', async (req, res) => {
  try {
    const { context } = req.body;
    const content = context || '';
    
    await fs.writeFile(CONTEXT_FILE_PATH, content, 'utf-8');
    res.json({ success: true, message: 'Context saved successfully' });
  } catch (error) {
    console.error('Error saving context file:', error);
    res.status(500).json({ error: 'Failed to save context file' });
  }
});

export default router;


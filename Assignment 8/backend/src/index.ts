import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import { animals, users } from './data';

const app: Application = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: '../frontend' });
});

app.get('/api/animals', (req: Request, res: Response) => {
  res.json(animals);
});

app.get('/api/animals/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const animal = animals.find(a => a.id === id);
  animal ? res.json(animal) : res.status(404).json({ error: 'Animal not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
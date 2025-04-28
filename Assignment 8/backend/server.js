const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'national-geographic-animal-app-secret';

console.log('Current directory:', __dirname);

const animalsPath = path.join(__dirname, 'data', 'animals.json');

console.log('Looking for animals.json at:', animalsPath);

let animals = [];
if (fs.existsSync(animalsPath)) {
  try {
    const data = fs.readFileSync(animalsPath, 'utf8');
    animals = JSON.parse(data);
    console.log(`Successfully loaded ${animals.length} animals from ${animalsPath}`);
  } catch (error) {
    console.error('Error loading animals data:', error);
  }
} else {
  console.error(`File not found: ${animalsPath}`);
  
  const searchForFile = (dir, filename) => {
    console.log(`Searching in ${dir}...`);
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const found = searchForFile(filePath, filename);
        if (found) return found;
      } else if (file === filename) {
        console.log(`Found ${filename} at ${filePath}`);
        return filePath;
      }
    }
    return null;
  };
  
  try {
    const baseDir = path.join(__dirname, '..', '..');
    const foundPath = searchForFile(baseDir, 'animals.json');
    
    if (foundPath) {
      console.log(`Found animals.json at ${foundPath}, loading...`);
      const data = fs.readFileSync(foundPath, 'utf8');
      animals = JSON.parse(data);
      console.log(`Successfully loaded ${animals.length} animals`);
    }
  } catch (error) {
    console.error('Error searching for animals.json:', error);
  }
}

let users = [];
const usersPath = path.join(__dirname, 'data', 'users.json');

if (fs.existsSync(usersPath)) {
  try {
    const data = fs.readFileSync(usersPath, 'utf8');
    users = JSON.parse(data);
    console.log(`Successfully loaded ${users.length} users`);
  } catch (error) {
    console.error('Error loading users data:', error);
  }
} else {
  console.log('Users file not found, creating default users');
  users = [
    {
      id: 1,
      username: "admin",
      password: "password123",
      name: "John Smith"
    },
    {
      id: 2,
      username: "jane",
      password: "password456",
      name: "Jane Doe"
    }
  ];
  
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  console.log('Default users created');
}

const saveAnimals = () => {
  const dir = path.dirname(animalsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(animalsPath, JSON.stringify(animals, null, 2));
};

const authenticateToken = (req, res, next) => {
  const authToken = req.headers.authtoken;

  if (!authToken) {
    return res.status(401).json({ error: "Error: Unauthorized" });
  }

  jwt.verify(authToken, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Error: Unauthorized" });
    }
    req.user = user;
    next();
  });
};

const isValidWholeNumber = (str) => {
  return /^\d+$/.test(str);
};

app.get('/animals', (req, res) => {
  try {
    console.log(`Returning ${animals.length} animals`);
    res.status(200).json(animals);
  } catch (error) {
    console.error('Error in GET /animals:', error);
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.get('/animals/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidWholeNumber(id)) {
      return res.status(400).json({ error: "Error: id must be a valid whole number" });
    }

    const animal = animals.find(a => a.id === parseInt(id));

    if (!animal) {
      return res.status(404).json({ error: "Error: animal not found" });
    }

    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Error: Malformed/Invalid Request Body -- missing required fields" });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: "Error: Unauthorized" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.post('/animals', authenticateToken, (req, res) => {
  try {
    const { name, sciName, description, images, video, events } = req.body;

    if (!name || !sciName || !description || !Array.isArray(description) || 
        !images || !Array.isArray(images) || !video || 
        !events || !Array.isArray(events)) {
      return res.status(400).json({ error: "Error: Malformed/Invalid Request Body -- missing or invalid required fields" });
    }

    const existingAnimal = animals.find(animal => animal.name.toLowerCase() === name.toLowerCase());
    if (existingAnimal) {
      return res.status(400).json({ error: "Error: An animal with this name already exists" });
    }

    for (const event of events) {
      if (!event.name || !event.date || !event.url) {
        return res.status(400).json({ error: "Error: Malformed/Invalid Request Body -- event missing required fields" });
      }
      
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(event.date)) {
        return res.status(400).json({ error: "Error: Malformed/Invalid Request Body -- invalid date format" });
      }
    }

    const newId = animals.length > 0 ? Math.max(...animals.map(a => a.id)) + 1 : 1;
    const newAnimal = {
      id: newId,
      name,
      sciName,
      description,
      images,
      video,
      events,
      createdBy: req.user.id
    };

    animals.push(newAnimal);
    saveAnimals();

    res.status(201).json({
      message: "successfully created new animal record",
      id: newId
    });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.put('/animals/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidWholeNumber(id)) {
      return res.status(400).json({ error: "Error: id must be a valid whole number" });
    }
    
    const animalIndex = animals.findIndex(a => a.id === parseInt(id));
    
    if (animalIndex === -1) {
      return res.status(404).json({ error: "Error: animal not found" });
    }
    
    const { name, sciName, description, images, video, events } = req.body;
    
    if (!name || !sciName || !description || !Array.isArray(description) || 
        !images || !Array.isArray(images) || !video || 
        !events || !Array.isArray(events)) {
      return res.status(400).json({ error: "Error: Malformed/Invalid Request Body -- missing or invalid required fields" });
    }
    
    const existingAnimal = animals.find(animal => 
      animal.name.toLowerCase() === name.toLowerCase() && animal.id !== parseInt(id)
    );
    
    if (existingAnimal) {
      return res.status(400).json({ error: "Error: An animal with this name already exists" });
    }
    
    for (const event of events) {
      if (!event.name || !event.date || !event.url) {
        return res.status(400).json({ error: "Error: Malformed/Invalid Request Body -- event missing required fields" });
      }
      
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(event.date)) {
        return res.status(400).json({ error: "Error: Malformed/Invalid Request Body -- invalid date format" });
      }
    }
    
    const updatedAnimal = {
      id: parseInt(id),
      name,
      sciName,
      description,
      images,
      video,
      events,
      createdBy: animals[animalIndex].createdBy
    };
    
    animals[animalIndex] = updatedAnimal;
    saveAnimals();
    
    res.status(200).json({
      message: "successfully updated animal record",
      id: parseInt(id)
    });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.delete('/animals/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidWholeNumber(id)) {
      return res.status(400).json({ error: "Error: id must be a valid whole number" });
    }

    const animalIndex = animals.findIndex(a => a.id === parseInt(id));

    if (animalIndex === -1) {
      return res.status(404).json({ error: "Error: animal not found" });
    }

    if (animals[animalIndex].createdBy !== req.user.id) {
      return res.status(403).json({ error: "Error: Forbidden - you can only delete animals you created" });
    }

    animals.splice(animalIndex, 1);
    saveAnimals();

    res.status(200).json({
      message: "successfully deleted animal record",
      id: parseInt(id)
    });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.get('/user', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(401).json({ error: "Error: Unauthorized" });
    }

    const userAnimals = animals
      .filter(animal => animal.createdBy === user.id)
      .map(animal => ({ id: animal.id, name: animal.name }));

    res.status(200).json({
      id: user.id,
      name: user.name,
      animals: userAnimals
    });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Animals API available at http://localhost:${PORT}/animals`);
});
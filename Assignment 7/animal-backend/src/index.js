import dotenv from 'dotenv';
import { readJsonFile, writeJsonFile } from './utils.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const animalsFilePath = './src/data/animals.json';
const usersFilePath = './src/data/users.json';

function isValidDate(dateString) {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  return regex.test(dateString);
}

function generateUniqueId(animals) {
  if (animals.length === 0) return 1;
  const maxId = Math.max(...animals.map((a) => a.id));
  return maxId + 1;
}

async function displayAllAnimals() {
  try {
    const animals = await readJsonFile(animalsFilePath);
    console.log('All Animals:');
    console.log(JSON.stringify(animals, null, 2));
  } catch (error) {
    console.error('Error displaying all animals:', error);
  }
}

async function displayAnimalById(id) {
  try {
    const animals = await readJsonFile(animalsFilePath);
    const animal = animals.find((a) => a.id === id);

    if (animal) {
      console.log(`Animal with ID ${id}:`);
      console.log(JSON.stringify(animal, null, 2));
    } else {
      console.log(`No animal found with ID ${id}.`);
    }
  } catch (error) {
    console.error('Error displaying animal by ID:', error);
  }
}

async function login(username, password) {
  try {
    const users = await readJsonFile(usersFilePath);
    const hash = crypto.createHash('sha256').update(`${username}:${password}`).digest('hex');
    const user = users.find((u) => u.hash === hash);

    if (user) {
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      console.log('Login successful! Token:', token);
    } else {
      console.log('Invalid username or password.');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}

async function getUserInfo(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const users = await readJsonFile(usersFilePath);
    const user = users.find((u) => u.id === decoded.userId);

    if (user) {
      console.log(`User ID: ${user.id}, Name: ${user.name}`);
      const animals = await readJsonFile(animalsFilePath);
      const userAnimals = animals.filter((a) => a.createdByUser === user.id);
      console.log('Animals added by this user:');
      console.log(JSON.stringify(userAnimals, null, 2));
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
  }
}

async function createAnimal(token, animalDataJson) {
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const users = await readJsonFile(usersFilePath);
    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      console.log('Invalid token: User not found.');
      return;
    }

    let animalData;
    try {
      animalData = JSON.parse(animalDataJson);
    } catch (error) {
      console.log('Invalid animal data: Must be a valid JSON string.');
      return;
    }

    if (
      !animalData.name ||
      !animalData.sciName ||
      !animalData.description ||
      !animalData.images ||
      !animalData.events
    ) {
      console.log('Invalid animal data: Missing required fields.');
      return;
    }

    if (animalData.description.length < 2) {
      console.log('Invalid animal data: Description must have at least 2 paragraphs.');
      return;
    }

    if (animalData.images.length < 1) {
      console.log('Invalid animal data: At least one image URL is required.');
      return;
    }

    if (animalData.events.length < 1) {
      console.log('Invalid animal data: At least one event is required.');
      return;
    }

    for (const event of animalData.events) {
      if (!event.name || !event.date || !event.url) {
        console.log('Invalid animal data: Each event must have a name, date, and URL.');
        return;
      }
      if (!isValidDate(event.date)) {
        console.log(`Invalid date format for event "${event.name}": Must be in mm/dd/yyyy format.`);
        return;
      }
    }

    const animals = await readJsonFile(animalsFilePath);
    const newId = generateUniqueId(animals);

    const newAnimal = {
      id: newId,
      createdByUser: user.id,
      ...animalData,
    };

    animals.push(newAnimal);
    await writeJsonFile(animalsFilePath, animals);

    console.log('Animal created successfully:', JSON.stringify(newAnimal, null, 2));
  } catch (error) {
    console.error('Error creating animal:', error);
  }
}

const [command, arg1, arg2] = process.argv.slice(2);

if (!command) {
  console.log('Please provide a command.');
  process.exit(1);
}

switch (command) {
  case 'animals':
    const [subCommand, subArg1, subArg2] = process.argv.slice(3);
    if (subCommand === 'all') {
      await displayAllAnimals();
    } else if (subCommand === 'one' && subArg1) {
      await displayAnimalById(parseInt(subArg1, 10));
    } else if (subCommand === 'create' && subArg1 && subArg2) {
      await createAnimal(subArg1, subArg2);
    } else {
      console.log('Invalid animals command. Usage:');
      console.log('  node src/index.js animals all');
      console.log('  node src/index.js animals one <id>');
      console.log('  node src/index.js animals create <token> <animal-data-json>');
    }
    break;

  case 'login':
    if (arg1 && arg2) {
      await login(arg1, arg2);
    } else {
      console.log('Please provide a username and password.');
    }
    break;

  case 'user':
    if (arg1) {
      await getUserInfo(arg1);
    } else {
      console.log('Please provide a token.');
    }
    break;

  default:
    console.log('Invalid command. Available commands:');
    console.log('  node src/index.js animals all');
    console.log('  node src/index.js animals one <id>');
    console.log('  node src/index.js animals create <token> <animal-data-json>');
    console.log('  node src/index.js login <username> <password>');
    console.log('  node src/index.js user <token>');
    break;
}
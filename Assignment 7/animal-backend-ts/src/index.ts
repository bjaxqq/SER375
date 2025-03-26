import dotenv from 'dotenv';
import { readJsonFile, writeJsonFile, isValidDate, generateUniqueId } from './utils';
import { Animal, User, AnimalEvent, DecodedToken } from './interfaces';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const animalsFilePath = './src/data/animals.json';
const usersFilePath = './src/data/users.json';

async function displayAllAnimals(): Promise<void> {
  try {
    const animals = await readJsonFile<Animal[]>(animalsFilePath);
    console.log('All Animals:');
    console.log(JSON.stringify(animals, null, 2));
  } catch (error) {
    console.error('Error displaying all animals:', error instanceof Error ? error.message : error);
  }
}

async function displayAnimalById(id: number): Promise<void> {
  try {
    const animals = await readJsonFile<Animal[]>(animalsFilePath);
    const animal = animals.find(a => a.id === id);

    if (animal) {
      console.log(`Animal with ID ${id}:`);
      console.log(JSON.stringify(animal, null, 2));
    } else {
      console.log(`No animal found with ID ${id}.`);
    }
  } catch (error) {
    console.error('Error displaying animal by ID:', error instanceof Error ? error.message : error);
  }
}

async function login(username: string, password: string): Promise<void> {
  try {
    const users = await readJsonFile<User[]>(usersFilePath);
    const hash = crypto.createHash('sha256').update(`${username}:${password}`).digest('hex');
    const user = users.find(u => u.hash === hash);

    if (user) {
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, { expiresIn: '1h' });
      console.log('Login successful! Token:', token);
    } else {
      console.log('Invalid username or password.');
    }
  } catch (error) {
    console.error('Error during login:', error instanceof Error ? error.message : error);
  }
}

async function getUserInfo(token: string): Promise<void> {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as DecodedToken;
    const users = await readJsonFile<User[]>(usersFilePath);
    const user = users.find(u => u.id === decoded.userId);

    if (user) {
      console.log(`User ID: ${user.id}, Name: ${user.name}`);
      const animals = await readJsonFile<Animal[]>(animalsFilePath);
      const userAnimals = animals.filter(a => a.createdByUser === user.id);
      console.log('Animals added by this user:');
      console.log(JSON.stringify(userAnimals, null, 2));
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error verifying token:', error instanceof Error ? error.message : error);
  }
}

async function createAnimal(token: string, animalDataJson: string): Promise<void> {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as DecodedToken;
    const users = await readJsonFile<User[]>(usersFilePath);
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      console.log('Invalid token: User not found.');
      return;
    }

    let animalData: Omit<Animal, 'id' | 'createdByUser'>;
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

    const animals = await readJsonFile<Animal[]>(animalsFilePath);
    const newId = generateUniqueId(animals);

    const newAnimal: Animal = {
      id: newId,
      createdByUser: user.id,
      ...animalData
    };

    animals.push(newAnimal);
    await writeJsonFile(animalsFilePath, animals);

    console.log('Animal created successfully:', JSON.stringify(newAnimal, null, 2));
  } catch (error) {
    console.error('Error creating animal:', error instanceof Error ? error.message : error);
  }
}

(async () => {
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
        console.log('  node src/index.ts animals all');
        console.log('  node src/index.ts animals one <id>');
        console.log('  node src/index.ts animals create <token> <animal-data-json>');
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
      console.log('  npm start animals all');
      console.log('  npm start animals one <id>');
      console.log('  npm start animals create <token> <animal-data-json>');
      console.log('  npm start login <username> <password>');
      console.log('  npm start user <token>');
      break;
  }
})();
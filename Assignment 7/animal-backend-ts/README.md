# Animal Backend

This is a CLI-based backend application for managing animal data. This version was written with TypeScript.

## Commands

### Animals

- Display All Animals:`npm start animals all` or `npx ts-node src/index.ts animals all`
- Display One Animal: `npm start animals one <id>` or `npx ts-node src/index.ts animals one <id>`
- Create New Animal: `npm start animals create <token> <animal-data-json>` or `npx ts-node src/index.ts animals create <token> <animal-data-json>`

### Login

- Login: `npm start login <username> <password>` or `npx ts-node src/index.ts <username> <password>`

### User

- Get user: `npm start user <token>` or `npx ts-node src/index.ts user <token>`

## Type Definitions

The application uses these TypeScript interfaces:

```typescript
interface Animal {
  id: number;
  createdByUser: number;
  name: string;
  sciName: string;
  description: string[];
  images: string[];
  events: AnimalEvent[];
}

interface AnimalEvent {
  name: string;
  date: string;
  url: string;
}

interface User {
  id: number;
  hash: string;
  name: string;
}
```

## Setup

1. Clone the repository: `git clone https://github.com/bjaxqq/SER375.git`
2. Navigate to the correct folder: `cd /path/to/SER375/Assignment\ 7`
3. Run `npm install` to install the correct dependencies
4. Create a `.env` file with the following content:

```
SECRET_KEY=your-secret-key
```
5. Run the application with the commands given above

## Data Setup

### Animals

- Location: `src/data/animals.json`
- Required fields:
    - `name`: Common name (string)
    - `sciName`: Scientific name (string)
    - `description`:  Array of at least 2 paragraphs
    - `images`: Array of at least 1 image URL
    - `events`: Array of event objects with name, date (MM/DD/YYYY), and URL

### Users

- Location: `src/data/users.json`
- Required fields:
    - `id`: Unique numeric ID
    - `hash`: SHA-256 hash of "username:password"
    - `name`: Display name

## Generating Hashes

To generate a hash for the username and password, you can run:

```
npx ts-node src/hash.ts <username> <password>
```
## Dependencies

- `dotenv`: For environment variables
- `jsonwebtoken`: For authentication tokens
- `crypto` For hashing passwords
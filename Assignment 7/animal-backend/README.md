# Animal Backend

This is a CLI-based backend application for managing animal data. This version was written with JavaScript

## Commands

### Animals

- Display All Animals:`node src/index.js animals all`
- Display One Animal: `node src/index.js animals one <id>`
- Create New Animal: `node src/index.js animals create <token> <animal-data-json>`

### Login

- Login: `node src/index.js login <username> <password>`

### User

- Get user: `node src/index.js user <token>`

## Setup

1. Clone the repository: `git clone https://github.com/bjaxqq/SER375.git`
2. Navigate to the correct folder: `cd /path/to/SER375/Assignment\ 7`
3. Run `npm install` to install the correct dependencies
4. Create a `.env` file with the following content:

```
SECRET_KEY=your-secret-key
```
5. Run the application with the commands given above

## Data Store

- Animals: `src/data/animals.json`
- Users: `src/data/users.json`

## Generating Hashes

To generate a hash for the username and password, you can run:

```
node src/hash.js <username> <password>
```
## Dependencies

- `dotenv`: For environment variables
- `jsonwebtoken`: For authentication tokens
- `crypto` For hashing passwords
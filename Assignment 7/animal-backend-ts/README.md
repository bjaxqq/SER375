# Animal Backend

This is a CLI-based backend application for managing animal data. This version was written with TypeScript.

## Commands

### Animals

- Display All Animals:`npm start animals all`
- Display One Animal: `npm start animals one <id>`
- Create New Animal: `npm start animals create <token> <animal-data-json>`

### Login

- Login: `npm start login <username> <password>`

### User

- Get user: `npm start user <token>`

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
npm start <username> <password>
```
## Dependencies

- `dotenv`: For environment variables
- `jsonwebtoken`: For authentication tokens
- `crypto` For hashing passwords
# Assignment 8 - National Geographic Animal Explorer

A web application that allows users to explore, create, and edit animal information in a National Geographic-style interface.

## Features

- Browse a collection of animals with detailed information
- View animal descriptions, images, videos, and related events
- Create new animal entries (authenticated users)
- Edit existing animal information (authenticated users)
- Dark mode support
- Responsive design for desktop and mobile devices
- User authentication system

## Prerequisites

- Node.js
- Web browser (Chrome, Firefox, Safari, etc.)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bjaxqq/SER375.git
   cd "SER375/Assignment 8"
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    node backend/server.js
    ```

4. Use Live Server or another tool to boot up the front end and navigate to:
    ```bash
    http://localhost:5500/frontend/
    ```

## Usage

### Browsing Animals

- Visit the homepage to see all available animals  
- Click on an animal card to view detailed information  

### Authentication

- Use the login page to authenticate  
- Default credentials:  
  - Username: `admin`, Password: `password`  
  - Username: `bjaxqq`, Password: `password`

### Creating Animals

- Log in with valid credentials  
- Click on **Add Animal** in the navigation or on your profile page  
- Fill out the form with animal details (name, scientific name, description paragraphs, image URLs, YouTube embed URL, and events)  
- Submit to create a new animal entry  

### Editing Animals

- Log in with valid credentials  
- Navigate to an animal’s detail page (e.g. click on its card)  
- Click the **Edit Animal** button  
- Modify any fields in the form (name, sciName, description, images, video, events)  
- Click **Save Changes** to submit your updates  

### Deleting Animals

- Log in with the same account that created the animal entry  
- On the animal’s detail page, click the **Delete Animal** button  
- A confirmation modal will appear:  
  1. Review the warning (“This action cannot be undone.”)  
  2. Click **Delete** to confirm, or **Cancel** to abort  
- Upon successful deletion you’ll be redirected back to the homepage  

> **Note:** Only the user who originally created an animal may delete it; attempting to delete someone else’s entry will result in a “Forbidden” error.

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--: | :--: | :--: | :--: |
| POST | `/login` | Authenticate user and receive a JWT token (expires in 1 hour). | No |
| GET | `/animals` | Retrieve a list of all animals. | No |
| GET | `/animals/:id` | Retrieve detailed information for a specific animal by its `id`. | No |
| POST | `/animals` | Create a new animal entry. Must include `name`, `sciName`, `description[]`, `images[]`, `video`, and `events[]`. | Yes |
| PUT | `/animals/:id` | Update an existing animal entry by its `id`. Same body requirements as POST `/animals`. | Yes |
| DELETE | `/animals/:id` | Delete an animal entry by its `id`. Only the user who created the animal can delete it. | Yes |
| GET | `/user` | Retrieve the authenticated user’s profile (`id`, `name`) and a list of animals they created (array of `{ id, name }`). | Yes |

## License

This project is part of SER375 coursework.
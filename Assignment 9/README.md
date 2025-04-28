# Assignment 9 - Amazon Clone

A full-stack e-commerce application that replicates the core functionality and design of Amazon.com. This project includes product browsing, detailed product pages, cart management, and user authentication.

## Features

- **User Authentication**: Login and account management
- **Product Browsing**: View all products with filtering and sorting options
- **Product Details**: Detailed product pages with images, descriptions, and related products
- **Image Preview Tool**: Zoom and preview product images
- **Shopping Cart**: Add, remove, and update quantities of items
- **Responsive Design**: Works on desktop and mobile devices
- **Amazon-like UI**: Closely resembles the Amazon.com user interface

## Technologies Used

### Frontend
- React
- React Router
- TypeScript
- CSS Modules
- Lucide React (for icons)

### Backend
- Node.js
- Express
- JSON file-based data storage

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bjaxqq/SER375.git
cd SER375/Assignment\ 9
```

2. Install dependencies for both frontend and backend:
```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Navigate to the backend directory
cd ..
cd backend

# Install backend dependencies
npm install
```

3. Start the backend server:
```bash
# In the backend directory
npm start
```

4. In a new terminal, start the frontend development server:
```bash
# In the project root directory
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Browsing Products
- The home page displays all available products
- Use the sidebar filters to narrow down products by category
- Sort products by price, rating, or featured status

### Product Details
- Click on any product to view its detailed page
- View multiple product images with zoom functionality
- See related products at the bottom of the page

### Shopping Cart
- Add products to your cart from the product page or browse page
- Adjust quantities or remove items in the cart page
- View the cart subtotal and proceed to checkout

### User Authentication
- Click "Sign In" to access the login page
- After logging in, you can view your account details and access your cart

## API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get a specific product by ID

### Authentication
- `POST /login` - Authenticate a user

### Cart
- `GET /cart` - Get the current user's cart
- `POST /cart` - Add a product to the cart
- `PUT /cart` - Update a cart item's quantity
- `DELETE /cart/:productId` - Remove a product from the cart

## License

This project is part of SER375 coursework.

## Acknowledgments

- Design inspired by Amazon.com
- Product data is fictional and for demonstration purposes only
- Icons provided by Lucide React

# E-Commerce Storefront Setup Guide

This is a complete e-commerce storefront built with Next.js frontend and Node.js/Express backend.

## Features Implemented

✅ **Product Listing with Filtering/Search**
- Product grid with pagination
- Search by product name
- Filter by category, price range
- Sort by name, price, rating, date
- Responsive design

✅ **Shopping Cart with Quantity Control**
- Add/remove items
- Update quantities
- Stock validation
- Persistent cart (localStorage)
- Real-time totals calculation

✅ **Checkout Simulation with Form Validation**
- Complete checkout form
- Shipping address validation
- Payment method selection
- Order processing with stock management
- Order confirmation page

✅ **User Authentication & Order History**
- User registration and login
- JWT-based authentication
- Order history tracking
- User profile management

## Technology Stack

**Frontend:**
- Next.js 15 with React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- React Hook Form
- Context API for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Zod validation
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free tier available)
- npm or pnpm

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB Atlas:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster (free tier)
   - Create a database user
   - Get your connection string
   - Whitelist your IP address (or use 0.0.0.0/0 for development)

4. Create environment file:
```bash
# Create .env file in backend directory
touch .env
```

5. Update `.env` with your MongoDB Atlas connection:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/mini_storefront?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

6. Seed the database:
```bash
npm run seed
```

7. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:4000`

### Frontend Setup

1. Navigate to project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

5. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Orders
- `POST /api/orders/checkout` - Create order (auth required)
- `GET /api/orders` - Get user orders (auth required)
- `GET /api/orders/:id` - Get single order (auth required)

### Development
- `POST /api/dev/seed` - Seed database (dev only)

## Testing the Application

1. **Browse Products**: Visit the homepage to see the product grid
2. **Search & Filter**: Use the sidebar filters to search and filter products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage Cart**: Open cart drawer to adjust quantities
5. **Checkout**: Click "Proceed to Checkout" (requires login)
6. **Register/Login**: Create an account or login with existing credentials
7. **Complete Order**: Fill out shipping form and place order
8. **View Orders**: Check order history in user menu

## Demo Credentials

You can create your own account or use these test credentials after registration:
- Email: `test@example.com`
- Password: `password123`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── checkout/          # Checkout pages
│   ├── orders/            # Order history
│   ├── profile/           # User profile
│   └── page.tsx           # Homepage
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── seed/          # Database seeding
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── cart/              # Shopping cart components
│   ├── checkout/          # Checkout components
│   ├── orders/            # Order components
│   ├── products/          # Product components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
└── hooks/                 # Custom hooks
```

## Key Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Cart updates instantly
- **Stock Management**: Prevents overselling
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling
- **Loading States**: Skeleton loaders and loading indicators
- **Toast Notifications**: User feedback for actions
- **Secure Authentication**: JWT-based auth with password hashing

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend
2. Use a production MongoDB instance
3. Set secure JWT secret
4. Configure CORS origins properly
5. Build frontend: `npm run build`
6. Use a process manager like PM2 for backend

## Support

This is a complete, production-ready e-commerce storefront with all the requested features implemented and tested.

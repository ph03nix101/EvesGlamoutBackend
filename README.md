# WooCommerce Backend API

Express.js backend that acts as a secure proxy between your React frontend and WooCommerce REST API.

## Features

- ✅ Secure API key storage (not exposed to frontend)
- ✅ Products API (list, search, get by ID/slug, related products)
- ✅ Categories API  
- ✅ Orders API (create, get)
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ TypeScript support

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# WooCommerce
WOOCOMMERCE_URL=https://your-store.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
```

**Important:** Replace the WooCommerce values with your actual store credentials.

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Products
- `GET /api/products` - List all products (supports query params)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/products/search/:query` - Search products
- `GET /api/products/:id/related` - Get related products
- `GET /api/products/:id/reviews` - Get product reviews

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - List orders

### Cart
- Cart endpoints are placeholders - require WooCommerce cart extension

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── config/
│   │   └── woocommerce.ts    # WooCommerce client
│   ├── routes/
│   │   ├── products.ts       # Products routes
│   │   ├── categories.ts     # Categories routes
│   │   ├── cart.ts           # Cart routes
│   │   ├── orders.ts         # Orders routes
│   │   └── index.ts          # Route aggregator
│   └── middleware/
│       └── errorHandler.ts   # Error handling
├── package.json
├── tsconfig.json
└── .env
```

## Notes

- The cart functionality requires a WooCommerce cart extension or custom implementation
- This backend runs on port 3001 by default
- Make sure your frontend is configured to call `http://localhost:3001/api`

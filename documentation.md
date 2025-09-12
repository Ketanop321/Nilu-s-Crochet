# Nilu' Crochet - Complete Local Web Application

A full-featured ecommerce web application for handmade crochet products with authentication, admin panel, email notifications, and file upload capabilities.

## Features

- **Authentication System**: Username/password login for both admin and customers
- **User Registration**: Optional account creation for customers
- **Email Notifications**: Order confirmations via MailerSend API
- **File Upload System**: Product image management
- **Admin Dashboard**: Complete product and order management
- **User Accounts**: Order history and profile management
- **Responsive Design**: Beautiful pastel-themed UI

## Prerequisites

- Node.js (v16 or higher)
- npm or pnpm package manager
- MailerSend API key (provided)

## Installation & Setup

### 1. Install Dependencies

```bash
# Install all dependencies
npm install

# Or using pnpm
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
JWT_SECRET=nilu-crochet-secret-key-2024

# MailerSend Configuration
MAILERSEND_API_KEY=mlsn.054c2524c06a706f96e97576b36a914c1f3ac6ed40854c34ccf07f7efe1eebe2

# Database (SQLite - no configuration needed)
```

### 3. Start the Application

```bash
# Development mode (starts both frontend and backend)
npm run dev

# Or using pnpm
pnpm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Default Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full admin dashboard, product management, order management

### Customer Account
- **Registration**: Visit the site and click "Sign Up"
- **Login**: Use registered credentials
- **Access**: Shopping, order history, profile management

## Application Structure

```
nilu-crochet-app/
├── server/                 # Backend Express.js server
│   ├── index.js           # Main server file
│   ├── database.sqlite    # SQLite database (auto-created)
│   └── uploads/           # Uploaded product images
├── src/                   # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── pages/            # Application pages
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities and configurations
├── public/               # Static assets
├── documentation.md      # This file
└── package.json         # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get orders (user's own or all for admin)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### File Upload
- `POST /api/upload` - Upload product images (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (admin only)

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `role` - 'admin' or 'customer'
- `full_name` - User's full name
- `phone` - Phone number
- `address` - Address
- `created_at` - Registration timestamp

### Products Table
- `id` - Product ID (UUID)
- `title` - Product name
- `category` - Product category
- `price` - Price in INR
- `availability` - Stock status
- `short_description` - Product description
- `lead_time` - Manufacturing time
- `sku` - Stock keeping unit
- `image_url` - Product image path
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Orders Table
- `id` - Order ID
- `user_id` - Customer ID (nullable for guest orders)
- `status` - Order status (pending, processing, shipped, delivered)
- `total_amount` - Total order value
- `shipping_address` - Delivery address
- `phone` - Contact phone
- `email` - Contact email
- `full_name` - Customer name
- `order_note` - Special instructions
- `created_at` - Order timestamp
- `updated_at` - Last update timestamp

### Order Items Table
- `id` - Primary key
- `order_id` - Reference to order
- `product_id` - Reference to product
- `quantity` - Item quantity
- `price` - Item price at time of order

## Admin Dashboard Features

### Product Management
- **Add Products**: Upload images, set details, pricing, and availability
- **Edit Products**: Update all product information including images
- **Delete Products**: Remove products from catalog
- **View Statistics**: Total products, categories, stock levels

### Order Management
- **View All Orders**: Complete order history with customer details
- **Update Order Status**: Change status (pending → processing → shipped → delivered)
- **Order Details**: View items, quantities, customer information
- **Revenue Tracking**: Total sales and order statistics

### User Management
- **Customer List**: View registered customers
- **Order History**: See customer purchase history
- **User Statistics**: Total customers, registration trends

## Customer Features

### Shopping Experience
- **Browse Products**: View all products with filtering and search
- **Product Details**: Detailed product pages with images
- **Shopping Cart**: Add/remove items, adjust quantities
- **Checkout**: Guest checkout or logged-in user checkout
- **Order Confirmation**: Email notifications via MailerSend

### Account Management
- **Registration**: Create customer account
- **Profile Management**: Update personal information
- **Order History**: View past orders and status
- **Address Book**: Save shipping addresses

## Email Notifications

The application uses MailerSend API to send:
- **Order Confirmations**: Sent immediately after order placement
- **Order Updates**: Status change notifications (optional)

Email template includes:
- Order details and ID
- Customer information
- Shipping address
- Expected delivery time
- Payment method (COD)

## File Upload System

### Supported Formats
- **Images**: JPG, PNG, GIF, WebP
- **Size Limit**: 5MB per file
- **Storage**: Local filesystem in `server/uploads/`

### Usage
- Admin can upload product images during product creation/editing
- Images are automatically resized and optimized
- Secure filename generation prevents conflicts

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Admin vs customer permissions
- **File Upload Validation**: Type and size restrictions
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin requests

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3001
   npx kill-port 3001
   
   # Or change port in .env file
   PORT=3002
   ```

2. **Database Connection Issues**
   - Database file is auto-created in `server/database.sqlite`
   - Check file permissions in server directory

3. **Email Not Sending**
   - Verify MailerSend API key in .env file
   - Check API key permissions in MailerSend dashboard
   - Verify sender domain configuration

4. **File Upload Failures**
   - Check `server/uploads/` directory exists and is writable
   - Verify file size is under 5MB limit
   - Ensure file is a valid image format

### Development Commands

```bash
# Start only backend server
npm run dev:server

# Start only frontend
npm run dev:client

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

## Production Deployment

### Environment Setup
1. Set production environment variables
2. Configure proper domain for MailerSend
3. Set up proper file storage (AWS S3, etc.)
4. Use production database (PostgreSQL, MySQL)
5. Configure HTTPS and security headers

### Database Migration
- Current setup uses SQLite for development
- For production, migrate to PostgreSQL or MySQL
- Update connection configuration in `server/index.js`

## Support

For technical issues or questions:
1. Check this documentation
2. Review console logs for errors
3. Verify environment variables
4. Test API endpoints directly

## License

This application is created for Nilu' Crochet business use.
# Project Summary
Nilu' Crochet is an advanced e-commerce platform specializing in handmade crochet products. It offers a visually appealing pastel-themed interface that enhances the shopping experience while ensuring secure authentication for customers and administrators. Key functionalities include a streamlined Cash on Delivery (COD) checkout process, automated email notifications for order confirmations, and a comprehensive admin dashboard for effective product and order management. Recent updates have further improved user registration and login processes, providing a seamless experience for all users.

# Project Module Description
The project consists of several functional modules:
- **Authentication**: Secure login for admins and customers, featuring registration and JWT-based authentication, including Google OAuth integration.
- **Email Notifications**: Utilizes MailerSend API for sending order confirmation emails with HTML templates.
- **File Upload System**: Allows admins to upload multiple product images with validation.
- **Admin Dashboard**: Full CRUD functionality for managing products, orders, and user accounts, including analytics and status tracking.
- **User Accounts**: Customers can create accounts, manage profiles, and view order history.
- **Product Management**: Admins can add, edit, delete, and view products with detailed specifications and inventory tracking.
- **MongoDB Atlas Integration**: Utilizes a cloud database for scalable and reliable data management.

# Directory Tree
```
nilu-crochet-app/
├── documentation.md         # Comprehensive setup and usage guide
├── package.json             # Project dependencies and scripts
├── server/                  # Backend Express.js server
│   ├── index.js             # Main server file with API routes and MongoDB connection
│   ├── models/              # Database models (User, Product, Order)
│   ├── uploads/             # Uploaded product images
└── src/                     # Frontend React application
    ├── components/          # Reusable UI components
    ├── pages/               # Application pages
    ├── hooks/               # Custom React hooks
    ├── contexts/            # Context API for authentication
    └── lib/                 # Utilities and configurations
└── shadcn-ui/               # UI components and configurations
    ├── tailwind.config.ts    # Configuration file for Tailwind CSS
    └── vite.config.ts       # Vite configuration file for the frontend
```

# File Description Inventory
- **documentation.md**: Full setup instructions, environment variables, and API documentation.
- **package.json**: Lists project dependencies and scripts for development and production.
- **server/index.js**: Main server file implementing Express.js backend with MongoDB integration and API routes.
- **server/models/**: Contains Mongoose models for User, Product, and Order.
- **uploads/**: Directory for storing uploaded product images.
- **src/**: Contains the frontend React application, including reusable components and pages.
- **src/contexts/**: Contains context providers for managing global state, such as authentication.
- **src/lib/api.ts**: API utility file for handling requests to the backend.
- **shadcn-ui/tailwind.config.ts**: Configuration file for Tailwind CSS.
- **shadcn-ui/vite.config.ts**: Configuration file for Vite, including server settings and proxy configurations.

# Technology Stack
- **React**: Frontend library for building user interfaces.
- **TypeScript**: Superset of JavaScript for type safety.
- **Vite**: Build tool for fast development and production builds.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Express.js**: Backend framework for building RESTful APIs.
- **MongoDB**: Cloud database for data storage.
- **MailerSend**: API for sending email notifications.
- **Multer**: Middleware for handling file uploads.
- **JWT**: For secure user authentication.
- **Radix UI**: Library for accessible UI components.
- **Tanstack Query**: For data fetching and state management.
- **Google Auth Library**: For Google OAuth integration.

# Usage
1. **Install Dependencies**: Run `pnpm install` to install project dependencies.
2. **Environment Variables**: Create a `.env` file in the server directory with the necessary configuration.
3. **Start the Application**: Run `pnpm run dev` to start both the frontend and backend servers.
4. **Build for Production**: Run `pnpm run build` to create a production build.

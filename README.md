# Smart Residence (ResiFlow)

A modern, flat-design residential society management system with an ultra-premium, ink-bordered user interface.

## 🏗️ Architecture

This project uses a full-stack MERN architecture (MongoDB, Express, React, Node.js) split into two main workspaces:
- **/client**: React frontend powered by Vite, utilizing Redux for state management, React Router for navigation, and Tailwind CSS for styling. It features a bold, high-contrast flat design language.
- **/server**: Node.js/Express backend connected to a MongoDB database via Mongoose, providing RESTful APIs for the application.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB instance (local or Atlas)

### Environment Variables

#### Server (`server/.env`)
Create a `.env` file in the `server` directory:
```
PORT=5000
DB_URL=mongodb://127.0.0.1:27017/smart-residence
JWT_SECRET=your_super_secret_jwt_key
```

#### Client (`client/.env`)
Create a `.env` file in the `client` directory:
```
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```
2. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

### Running the App Locally

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   *Runs on port 5000 by default and connects to MongoDB.*

2. **Start the frontend application:**
   ```bash
   cd client
   npm run dev
   ```
   *Runs on port 5173 by default.*

## 🌟 Key Features

- **Resident Dashboard**: Manage visitors, notices, complaints, and view dues.
- **Admin Panel**: Complete control over society management, user roles, and announcements.
- **Flat Ink-Style UI**: Unique aesthetic avoiding gradients/shadows in favor of high-contrast solid colors and thick borders.
- **Authentication**: JWT-based secure authentication.
- **Interactive Modals**: Seamless user experience for interactions.

## 🛠️ Utilities

### Seeding an Admin User
To seed a super admin user for initial login and system setup:
```bash
cd server
npm run seed:admin
```

## 📄 License
This project is licensed under the MIT License.

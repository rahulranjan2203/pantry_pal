# 🥦 Pantry Pal

Pantry Pal is a modern, full-stack inventory management web application designed to help households track kitchen supplies, minimize food waste, and discover custom recipes based on ingredients they already own. 

With intuitive expiration tracking, real-time filters, automated email notifications for expiring items, and third-party recipe integrations, Pantry Pal is a complete solution for smarter, waste-free kitchen management.

---

## 🚀 Key Features

*   🔐 **Secure User Authentication**: Complete user registration and login flows secured by password hashing (`bcryptjs`) and stateless JSON Web Tokens (JWT) for route authorization.
*   📋 **Real-Time Inventory Dashboard**: CRUD operations (Create, Read, Update, Delete) to track item name, category, quantity, purchase date, and expiration date.
*   ⚠️ **Smart Expiry Tracking**: Color-coded cards indicating shelf-life status and an automatic warning system for items nearing their expiration dates.
*   📧 **Automated Expiry Notifications**: Integrated **EmailJS** service that checks for items expiring within 2 days and automatically sends email alerts to the user.
*   🍲 **Dynamic Recipe Generator**: Integrates with **TheMealDB API**. Users can select multiple ingredients from their dashboard to query matching recipe ideas, cooking steps, and servings.
*   🌓 **Refined Dark Mode & Animations**: Beautiful responsive design built with Tailwind CSS and enhanced with smooth micro-animations using Framer Motion.

---

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: Component-based reactive UI structure.
*   **Tailwind CSS**: Modern utility-first CSS styling framework.
*   **Framer Motion**: Custom physics-based interface transitions and hover interactions.
*   **Lucide React**: Clean vector iconography.
*   **React Hot Toast**: Elegant, non-blocking toast notifications.
*   **EmailJS**: Client-side email dispatch for expiry warnings.

### Backend
*   **Node.js & Express**: Fast, unopinionated web framework for backend APIs.
*   **Sequelize ORM**: Promise-based Node.js ORM for mapping database tables to JavaScript models.
*   **MySQL Database**: Relational storage for structured items and user records.
*   **JWT & Bcrypt**: Hashed database password storage and tokenized endpoint protection.

---

## 📁 Repository Structure

```text
pantry-pal/
├── backend/
│   ├── models/            # Sequelize Database Schema (User, Item)
│   ├── server.js          # Express server with Auth & Item API routes
│   ├── database.js        # MySQL connection and Sequelize configuration
│   ├── setup_db.js        # Script to create db and sync tables
│   ├── migrate_db.js      # Relational schemas database migrator
│   ├── .env.example       # Template for backend configuration keys
│   └── package.json       # Backend server dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI elements (Navbar, RecipeIdeas, ItemCard, etc.)
│   │   ├── pages/         # Landing, Login, and Dashboard layouts
│   │   ├── services/      # Fetch wrappers for communication with API routes
│   │   ├── index.css      # Custom animations & global styling entrypoint
│   │   └── main.jsx       # React entry point
│   ├── index.html         # Single Page App index file
│   ├── tailwind.config.js # Tailwind system configuration
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend client dependencies
│
├── .gitignore             # Git ignored files template
├── start.bat              # Batch script for concurrent service startup
├── start-clean.bat        # Automated database setup + service startup
└── fix-and-start.bat      # Process cleanup + setup script
```

---

## 💻 Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16.0.0 or higher)
*   [MySQL Server](https://dev.mysql.com/downloads/installer/) (running on localhost port 3306)

### Step 1: Database Setup
Make sure your local MySQL instance is active. Create a database called `pantry_pal_db` or let the initialization script create it for you automatically.

### Step 2: Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Open the newly created `.env` file and replace the credentials with your local MySQL settings:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_root_password
   DB_NAME=pantry_pal_db
   PORT=5000
   JWT_SECRET=your_custom_jwt_secret_key
   ```

### Step 3: Fast Start (Windows Automated)
If you are on Windows, you can double-click **`start-clean.bat`** in the root directory. This script will:
1. Kill active processes running on port 5000 (if any).
2. Install all npm dependencies in both `/backend` and `/frontend`.
3. Auto-generate the MySQL schemas and synchronizations.
4. Launch both development servers concurrently.

### Step 4: Manual Startup
If running on Linux/macOS or doing a manual boot:

**Start the Backend:**
```bash
cd backend
npm install
node setup_db.js  # Runs initial database setup and tables creation
npm run dev       # Launches Nodemon watcher on http://localhost:5000
```

**Start the Frontend:**
```bash
cd ../frontend
npm install
npm run dev       # Starts Vite server on http://localhost:5173
```

---

## 🔑 Technical Highlights & Architecture

### User Data Isolation
Pantry items are mapped to the active user's primary key (`userId`) using a relational model. In the Express controllers, endpoints are shielded behind a custom `authenticateToken` middleware that parses JWT authorization headers, preventing cross-user data access:
```javascript
// backend/server.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### Relational Database Model
The application uses **Sequelize** models defining relationships between users and items to handle auto-joins, constraints, and cascading deletions:
```javascript
// User has many items, Items belong to a User
User.hasMany(Item, { foreignKey: 'userId', onDelete: 'CASCADE' });
Item.belongsTo(User, { foreignKey: 'userId' });
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
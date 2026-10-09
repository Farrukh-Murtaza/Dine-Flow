
# 🍽️ DineFlow — Restaurant Management System

A full-stack restaurant management application built with the MERN stack to help restaurant owners and staff manage daily restaurant operations.

## Overview

DineFlow brings essential restaurant workflows into one application, including order management, menu operations, staff access control, and inventory tracking.

The project is being developed as a practical full-stack application using React, TypeScript, Node.js, Express, and MongoDB.

## Screenshots

| Login Page 
| --- |
| ![Login Page ](/client/src/assets/screenshots/login.png) 

| Dashboard | Category |
| --- | --- |
| ![Dashboard](/client/src/assets/screenshots/dashboard.png) | ![Category](/client/src/assets/screenshots/category.png) |

| Menu | New Order |
| --- | --- |
| ![Menu](/client/src/assets/screenshots/menu.png) | ![New Order](/client/src/assets/screenshots/new-orders.png) |

| Order | Inventory |
| --- | --- |
| ![Dashboard](/client/src/assets/screenshots/order.png) | ![Inventory](/client/src/assets/screenshots/inventory.png) |

| Staff | Settings |
| --- | --- |
| ![Staff](/client/src/assets/screenshots/staff.png) | ![Settings](/client/src/assets/screenshots/setting.png) |



## Features

### 📊 Dashboard

* Centralized restaurant management interface.
* Operational summaries and dashboard cards.
* Navigation to management modules.

### 🧾 Order Management

* Create and view customer orders.
* Track order items, quantities, tables, and totals.
* Manage order statuses: Pending, Served, and Completed.
* Filter orders by status.

### 🍔 Menu Management

* Organize restaurant menu information.
* Support menu-related operations.
* Restrict management actions according to user permissions.

### 📦 Inventory Management

* Track inventory quantities and units.
* Configure minimum stock levels.
* Identify low-stock items.
* Calculate inventory value using current quantity and unit cost.
* Search, filter, add, edit, and delete inventory items.

### 🔐 Role-Based Access

DineFlow is designed around these restaurant staff roles:

| Role        | Intended responsibilities                            |
| ----------- | ---------------------------------------------------- |
| Owner       | Restaurant administration and staff management       |
| Manager     | Day-to-day operations and permitted staff management |
| Cashier     | Order-taking and menu access                         |
| Storekeeper | Inventory and stock management                       |

Sensitive operations must be authorized by the backend, not merely hidden in the user interface.

## Technology Stack

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Lucide React

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt

## Project Structure

```text
Dine-Flow/
├── client/
│   ├── src/
│   ├── package.json
│   └── README.md
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── README.md
├── package.json
└── README.md
```

The exact internal folder structure may evolve as the project develops.

## Getting Started

### Prerequisites

* Node.js and npm
* MongoDB or a MongoDB Atlas database
* Git

### 1. Clone the repository

```bash
git clone https://github.com/Farrukh-Murtaza/Dine-Flow.git
cd Dine-Flow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create the environment files required by your client and server. See the [Server README](./server/README.md) for backend configuration and the [Client README](./client/README.md) for frontend configuration.

Never commit secrets, database credentials, or private environment files to GitHub.

### 4. Run the application

Open two terminals from the repository root.

**Terminal 1 — Backend**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
```

Install dependencies inside each workspace if your root installation does not install them.

Use the URLs printed by the development servers to access the application.

## Documentation

* [Frontend Setup and Documentation](./client/README.md)
* [Backend Setup and API Documentation](./server/README.md)

## Roadmap

* Expand restaurant sales reports and analytics.
* Connect ingredient usage to menu recipes and order completion.
* Add inventory movement history and stock adjustments.
* Expand automated testing and error handling.
* Document and deploy a production-ready demo.

## Author

**Farrukh Murtaza**

* GitHub: [@Farrukh-Murtaza](https://github.com/Farrukh-Murtaza)
* Repository: [Dine-Flow](https://github.com/Farrukh-Murtaza/Dine-Flow)

## License

No license is specified in this README. Add a `LICENSE` file if you decide to distribute the project under an open-source license.

---

*DineFlow — Simplifying restaurant operations, one workflow at a time.*

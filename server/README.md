# DineFlow Server

The backend API for DineFlow, a restaurant management system built with Node.js, Express, MongoDB, and Mongoose.

## Responsibilities

The backend is responsible for:

* Processing client API requests.
* Persisting restaurant data in MongoDB.
* Managing authentication and protected routes.
* Enforcing role-based permissions.
* Validating incoming data.
* Handling order, menu, staff, and inventory operations.

## Technology Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt

## Getting Started

### Prerequisites

* Node.js and npm.
* A MongoDB Atlas database.
* Required environment variables.

### 1. Install dependencies

From the repository root:

```bash
npm install
```

Alternatively:

```bash
cd server
npm install
```

### 2. Configure environment variables

Create a `.env` file in the `server` directory using the variable names expected by your server code.

Example:

```env
URL=http://localhost
PORT=5001
CLIENT_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

These are example names. Check your database connection, authentication configuration, and server entry point to confirm the exact names your application requires.

**Security**

* Never commit `.env` files.
* Use strong, private JWT secrets.
* Keep database credentials private.
* Validate and authorize all protected requests on the server.

### 3. Start the development server

```bash
npm run dev
```

Run this command from the `server` directory.

If your package uses a different development script, use the script defined in `server/package.json`.

## API Organization

The backend can be organized around resource-specific routes, controllers, models, and middleware.

```text
server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── server.js
└── package.json
```

The actual entry point and directory names may differ in the current repository.

## API Resources

The following table describes the intended API resource groups. Confirm each endpoint in the implementation before treating it as available.

| Resource       | Purpose                                       |
| -------------- | --------------------------------------------- |
| Authentication | Login and protected access                    |
| Staff          | Staff accounts and role permissions           |
| Menu           | Restaurant menu data                          |
| Orders         | Order creation, retrieval, and status updates |
| Inventory      | Inventory CRUD and stock tracking             |

A resource's exact endpoint paths and HTTP methods depend on the registered Express routes.

## Authentication and Authorization

Protected routes should verify the user's identity and permissions before allowing access.

Role-based rules should be enforced in backend middleware or controllers. The server should also ensure that records belong to the correct restaurant.

Never rely exclusively on frontend restrictions to protect staff accounts, sales data, inventory, or restaurant settings.

## Error Handling and Validation

Backend handlers should:

* Validate request parameters and body data.
* Return suitable HTTP status codes.
* Handle missing or invalid resource IDs.
* Check record ownership and restaurant scope.
* Avoid exposing passwords, JWT secrets, or other sensitive information.
* Return useful error messages without leaking internal details.

## Development and Testing

Start the backend and verify that:

1. MongoDB connects successfully.
2. The server starts on the configured port.
3. Authentication works as expected.
4. Protected routes reject unauthenticated requests.
5. Role restrictions are enforced.
6. Client API requests receive the expected responses.

## Related Documentation

* [Main Project README](../README.md)
* [Frontend README](../client/README.md)

## Author

Farrukh Murtaza — [GitHub](https://github.com/Farrukh-Murtaza)

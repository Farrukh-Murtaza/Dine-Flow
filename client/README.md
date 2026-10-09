# DineFlow Client

The frontend application for DineFlow, a restaurant management system built with React, TypeScript, Vite, and Tailwind CSS.

## Features

* Restaurant dashboard and navigation.
* Order management with status filters.
* Inventory management interface.
* Reusable UI components and modal dialogs.
* API communication using Axios.
* Client-side navigation using React Router DOM.
* Iconography using Lucide React.

## Technology Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Lucide React

## Getting Started

### Prerequisites

* Node.js and npm.
* The DineFlow backend running locally or deployed.
* Access to a configured backend API.

### 1. Install dependencies

From the repository root:

```bash
npm install
```

Alternatively, install client dependencies directly:

```bash
cd client
npm install
```

### 2. Configure the API URL

Create a `.env` file inside the `client` directory if your application uses a configurable API URL.

Example:

```env
VITE_API_URL=http://localhost:5001/api
```

The variable name and URL must match the Axios configuration used in your application. Vite exposes client environment variables prefixed with `VITE_`, so never put private secrets in these variables.

### 3. Start the development server

From the repository root:

```bash
cd client
npm run dev
```

Vite will print the local URL in your terminal. 

```text
http://localhost:3000
```

### 4. Build for production

```bash
npm run build
```

### 5. Run linting

If the client package defines a lint script:

```bash
npm run lint
```

## API Integration

The frontend communicates with the backend through HTTP requests. Axios is used for API calls, while the server is responsible for data persistence, validation, authentication, and authorization.

The backend API URL should point to the running DineFlow server.

## Development Notes

* Keep reusable UI components in the appropriate shared components directory.
* Keep feature-specific screens and API functions organized by feature.
* Use environment variables for environment-specific configuration.
* Handle API loading, error, empty, and success states.
* Do not rely on frontend visibility rules as the only security mechanism.

## Related Documentation

* [Main Project README](../README.md)
* [Backend README](../server/README.md)

## Author

Farrukh Murtaza — [GitHub](https://github.com/Farrukh-Murtaza)

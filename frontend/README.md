# Frontend App

This is the React frontend for the salon management system. It connects to the Django backend through the Axios client in `src/services/api.js`.

## Prerequisites

- Node.js 18 or newer
- npm
- The backend running on http://127.0.0.1:8000

## Setup

```bash
cd Frontend
npm install
```

If the project is missing Tailwind setup, run:

```bash
npx tailwindcss init -p
```

## Run the frontend

```bash
cd Frontend
npm start
```

This starts the React development server at:

- http://localhost:3000

## API connection

The frontend uses:

```js
baseURL: "http://127.0.0.1:8000/api";
```

That means the Django backend must already be running before the UI can load data.

## Common commands

```bash
npm start
npm test
npm run build
```

## Project structure

- `src/pages/` — dashboard, services, appointments, booking screens
- `src/components/` — reusable UI cards/sidebar
- `src/services/api.js` — Axios client configuration
- `src/layouts/` — page layout components

## Notes

- The frontend expects the backend API schema and routes to be available before launch.
- For local development, start the backend first and then the frontend.
- If you see a network error, confirm the Django server is running and CORS is enabled in the backend.

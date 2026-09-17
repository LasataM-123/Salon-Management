# Backend API

This project is the Django REST API for the salon management system. It exposes CRUD endpoints for services and appointments and stores data in a local SQLite database.

## Prerequisites

- Python 3.11 or newer
- Pip or uv
- A terminal in the Backend folder

## Database setup

The project is configured to use SQLite by default in `config/settings.py`.

- Database file: `Backend/db.sqlite3`
- Engine: `django.db.backends.sqlite3`

To create the database tables, run:

```bash
cd Backend
python manage.py migrate
```

If you want a fresh local database, delete the existing `db.sqlite3` file and run the migration again.

### Schema

The app uses Django migrations to generate the database schema.

#### `service` table

| Column     | Type                 | Notes                  |
| ---------- | -------------------- | ---------------------- |
| `id`       | BigAutoField         | Primary key            |
| `name`     | CharField(120)       | Service name           |
| `price`    | DecimalField(10,2)   | Must be greater than 0 |
| `duration` | PositiveIntegerField | Duration in minutes    |

Model: `apps.service.models.Service`

#### `appointment` table

| Column           | Type           | Notes                                    |
| ---------------- | -------------- | ---------------------------------------- |
| `id`             | BigAutoField   | Primary key                              |
| `customer_name`  | CharField(120) | Customer name                            |
| `customer_phone` | CharField(30)  | Contact number                           |
| `service_id`     | ForeignKey     | References service                       |
| `date`           | DateField      | Booking date                             |
| `time`           | TimeField      | Booking time                             |
| `notes`          | TextField      | Optional notes                           |
| `status`         | CharField(20)  | Pending, Confirmed, Completed, Cancelled |
| `created_at`     | DateTimeField  | Auto-populated                           |

Model: `apps.appointment.models.Appointment`

Important database constraints:

- A booking cannot use the same service at the same date and time more than once.
- The `service` relationship is protected with `on_delete=models.PROTECT`.

The unique constraint is defined in `apps/appointment/migrations/0002_appointment_unique_service_booking_slot.py`.

## Setup

### Option 1: pip

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate      # Windows PowerShell
python -m pip install --upgrade pip
python -m pip install django djangorestframework django-cors-headers drf-spectacular
```

### Option 2: uv

```bash
cd Backend
uv sync
```

## Run the backend

```bash
cd Backend
python manage.py runserver 0.0.0.0:8000
```

Then open:

- API root: http://127.0.0.1:8000/api/
- Swagger docs: http://127.0.0.1:8000/api/docs/
- Admin: http://127.0.0.1:8000/admin/

## Useful commands

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py check
```

## Main API routes

- `GET /api/services/`
- `POST /api/services/`
- `GET /api/appointments/`
- `POST /api/appointments/`

The app uses Django REST Framework and OpenAPI schema generation via `drf-spectacular`.


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


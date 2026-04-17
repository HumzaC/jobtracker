# JobTrack

A full-stack job application tracker built with FastAPI and React. Track every application through a visual kanban board, update statuses with drag and drop, and manage your entire job search in one place.

![Dashboard](screenshots/dashboard.png)

---

## Features

- **Kanban board** — drag and drop applications between Applied, Interview, Offer, Rejected, and Withdrawn columns
- **List view** — toggle to a sortable table view of all applications
- **Full CRUD** — add, edit, and delete job applications
- **JWT authentication** — secure login and registration with token-based auth
- **Stats bar** — live count of applications per status
- **Persistent sessions** — stay logged in after page refresh

---

## Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — Python REST API framework
- [PostgreSQL](https://www.postgresql.org/) — relational database
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM for database models
- [Alembic](https://alembic.sqlalchemy.org/) — database migrations
- [python-jose](https://github.com/mpdavis/python-jose) — JWT token creation and validation
- [passlib](https://passlib.readthedocs.io/) — password hashing with bcrypt
- [Docker](https://www.docker.com/) — containerized PostgreSQL database

**Frontend**
- [React 18](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [React Router](https://reactrouter.com/) — client-side routing
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) — drag and drop
- [Axios](https://axios-http.com/) — HTTP client
- [Lucide React](https://lucide.dev/) — icons

---

## Project Structure

```
job-tracker/
├── app/                        # FastAPI backend
│   ├── main.py                 # App entry point, router registration
│   ├── config.py               # Settings from .env
│   ├── api/
│   │   ├── auth.py             # POST /auth/login
│   │   ├── users.py            # POST /users/
│   │   └── applications.py     # CRUD /applications/
│   ├── core/
│   │   ├── deps.py             # get_current_user dependency
│   │   ├── jwt.py              # Token creation
│   │   └── security.py         # Password hashing
│   ├── db/
│   │   ├── base.py             # SQLAlchemy declarative base
│   │   ├── database.py         # Engine and session factory
│   │   └── session.py          # get_db dependency
│   ├── models/
│   │   ├── user.py             # User model
│   │   └── job_application.py  # JobApplication model
│   └── schemas/
│       ├── auth.py             # TokenResponse schema
│       ├── user.py             # UserCreate, UserResponse
│       └── jobApplication.py   # JobApplication schemas
├── alembic/                    # Database migrations
├── job-tracker-frontend/       # React frontend
│   ├── src/
│   │   ├── api/                # Axios client + API helpers
│   │   ├── context/            # Auth context
│   │   ├── components/         # KanbanBoard, ApplicationTable, Modal
│   │   └── pages/              # Login, Register, Dashboard
│   └── vite.config.js          # Dev server + proxy config
├── docker-compose.yml          # PostgreSQL container
├── .env                        # Environment variables
└── requirements.txt            # Python dependencies
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login with email + password, returns JWT | No |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/` | Register a new user | No |

### Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/applications/` | List all applications for current user | Yes |
| POST | `/applications/` | Create a new application | Yes |
| GET | `/applications/{id}` | Get a single application | Yes |
| PATCH | `/applications/{id}` | Update an application | Yes |
| DELETE | `/applications/{id}` | Delete an application | Yes |

### Other
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Get current logged-in user | Yes |

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker Desktop

### 1. Clone the repository

```bash
git clone https://github.com/HumzaC/jobtracker.git
cd job-tracker
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+psycopg://jobtracker:jobtracker_pw@127.0.0.1:5433/jobtracker
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
```

### 3. Start the database

```bash
docker-compose up -d
```

### 4. Set up the backend

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

alembic upgrade head
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### 5. Set up the frontend

```bash
cd job-tracker-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Usage

1. Open `http://localhost:5173`
2. Register a new account
3. Add job applications using the **+ Add** button
4. Drag cards between columns to update their status
5. Toggle between **Board** and **List** views using the toolbar

# Foodfit

Foodfit is a full-stack AI-powered meal planning app that helps users generate recipes, manage pantry items, save favorite recipes, organize weekly meal plans, and maintain a shopping list.

Live app: [foodfit-1-ck94.onrender.com](https://foodfit-1-ck94.onrender.com/)

## Overview

Foodfit combines recipe generation with practical kitchen planning tools:

- Generate recipes with AI based on ingredients or pantry items
- Save and browse recipes in a personal library
- Track pantry inventory and expiry dates
- Plan meals for the week
- Build and manage a shopping list
- Store user preferences and dietary settings

## Features

### Authentication

- User signup and login
- JWT-based protected routes
- Persistent auth state on the frontend

### AI Recipe Generator

- Generate recipes from typed ingredients
- Optionally use pantry ingredients as input
- Apply filters like cuisine, servings, dietary restrictions, and cooking time
- Save generated recipes to your collection

### Pantry Management

- Add, browse, search, and delete pantry items
- Filter by category
- Highlight items expiring soon
- Get recipe suggestions based on available pantry ingredients

### Recipe Library

- View saved recipes
- Open recipe details
- Delete saved recipes
- Inspect ingredients, instructions, and nutrition data

### Meal Planner

- Plan breakfast, lunch, and dinner by week
- Assign saved recipes to meal slots
- Remove meals from the planner

### Shopping List

- Add and manage shopping list items
- Mark items as complete
- Clear checked or all items
- Generate list items from the meal plan

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React
- date-fns

### Backend

- Node.js
- Express
- PostgreSQL
- `pg`
- JWT authentication
- bcrypt / bcryptjs
- Google Gemini API via `@google/genai`

### Database

The PostgreSQL schema includes tables for:

- `users`
- `user_preferences`
- `pantry_items`
- `recipes`
- `recipe_ingredients`
- `recipe_nutrition`
- `meal_plans`
- `shopping_list_items`

## Project Structure

```text
Project/
├── frontend/          # React + Vite client
├── backend/           # Express API and database logic
├── README.md
└── ...
```

### Important Frontend Files

- `frontend/src/App.jsx` - application routes
- `frontend/src/context/AuthContext.jsx` - auth state handling
- `frontend/src/services/api.js` - Axios client and API base URL
- `frontend/src/components/ProtectedRoute.jsx` - route protection
- `frontend/src/pages/` - all major screens

### Important Backend Files

- `backend/server.js` - Express bootstrap and route registration
- `backend/routes/` - API route definitions
- `backend/controllers/` - request handlers
- `backend/models/` - database interaction layer
- `backend/config/schema.sql` - PostgreSQL schema
- `backend/config/db.js` - database connection
- `backend/migrate.js` - schema migration runner
- `backend/utils/gemini.js` - Gemini integration

## Environment Variables

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

The repo currently includes `frontend/.env.example` pointing to a deployed backend URL.

### Backend

Create `backend/.env`:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
PORT=8000
NODE_ENV=development
```

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Project
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

- Add `frontend/.env`
- Add `backend/.env`

### 4. Run database migration

From the `backend` folder:

```bash
node migrate.js
```

### 5. Start the backend

From the `backend` folder:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:8000
```

### 6. Start the frontend

From the `frontend` folder:

```bash
npm run dev
```

Frontend runs on the Vite development server, usually:

```text
http://localhost:5173
```

## Available Scripts

### Frontend

From `frontend/`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

From `backend/`:

```bash
npm run dev
node migrate.js
```

Note: `npm test` in the backend is currently a placeholder and does not run a real test suite.

## API Overview

The backend exposes these main route groups:

- `/api/auth`
- `/api/users`
- `/api/pantry`
- `/api/recipes`
- `/api/meal-plan`
- `/api/shopping-list`

The root backend route responds with:

```text
AI Recipe Generator API
```

## Deployment

The app is deployed on Render:

- Frontend: [foodfit-1-ck94.onrender.com](https://foodfit-1-ck94.onrender.com/)
- Backend API base used in the frontend fallback: `https://foodfit-jfs2.onrender.com/api`

## Current Notes

Some parts of the app appear to be partially complete or still evolving:

- `Settings` includes UI that is not fully wired end-to-end
- The dashboard includes some placeholder or incomplete meal widgets
- A reset password backend route exists, but a matching frontend route is not clearly exposed
- Some shopping list to pantry flows may still be under development

## Suggested Screenshots For Documentation

If you want to improve this README later, add screenshots for:

- Login / signup
- Dashboard
- AI recipe generator
- Pantry page
- Meal planner
- Shopping list

## Future Improvements

- Add a proper backend test suite
- Add API endpoint documentation
- Add screenshots and GIF demos
- Add contribution guidelines
- Add a production deployment guide

## License

Add your preferred license here.
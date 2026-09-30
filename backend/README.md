# Backend

## Summary

The backend is an Express API that stores and retrieves a signed-in user's favorite recipes in PostgreSQL. It exposes a health check and the favorite operations required by the mobile app, using Neon and Drizzle ORM for database access.

JavaScript, Node.js, Express, Drizzle ORM, Drizzle Kit, Neon Serverless, PostgreSQL, dotenv, cron, Nodemon, npm

## Functions / Features

- ❤️ Add a recipe to a user's favorites
- 📚 List all favorites for a user
- 🗑️ Remove a specific recipe from a user's favorites
- 🩺 Provide an API health check
- ⏱️ Define an optional fourteen-minute API keep-alive job; it is disabled in `src/server.js`

## Technologies and Their Functions

- 🟨 **JavaScript / Node.js**: Runs the ES module backend. `src/server.js` is the package entry point.
- 🚂 **Express 5.2.1**: Creates the HTTP server, parses JSON request bodies, and defines routes.
- 🐘 **PostgreSQL**: Database dialect used by the schema and migration.
- 🌐 **Neon Serverless 1.1.0**: Creates the PostgreSQL HTTP client from `DATABASE_URL`.
- 🧱 **Drizzle ORM 0.45.2**: Defines the schema and performs inserts, selects, and deletes.
- 🛠️ **Drizzle Kit 0.31.11**: Configures PostgreSQL migrations from `src/db/schema.js` into `src/db/migrations`. No migration script is declared in `package.json`.
- 🔐 **dotenv 17.4.2**: Loads environment variables.
- ⏲️ **cron 4.4.0**: Defines the optional `*/14 * * * *` keep-alive job in `src/config/cron.js`; its server import and startup call are commented out.
- 🔄 **Nodemon 3.1.14**: Restarts the server for the `dev` script.
- 📦 **npm**: Installs dependencies from `package-lock.json` and runs scripts.
- 🌍 **cors 2.8.6**: Declared as a dependency, but no current source file imports or configures it.

### Environment variables

The backend reads these names from `backend/.env` or the process environment:

- `PORT`: HTTP port; defaults to `5001`.
- `DATABASE_URL`: Neon/PostgreSQL connection URL used by Drizzle.
- `NODE_ENV`: Read by the commented production cron startup condition.
- `API_URL`: Read by the optional cron job for its keep-alive request.

### API routes

All routes are prefixed with `/api`.

| Method   | Route                              | Behavior                                                                                                                                        |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/health`                      | Returns `{ "success": true }` with status `200`.                                                                                                |
| `POST`   | `/api/favorites`                   | Requires `userId`, `recipeId`, and `title`; optionally accepts `image`, `cookTime`, and `servings`; returns the inserted row with status `201`. |
| `GET`    | `/api/favorites/:userId`           | Returns favorite rows whose `user_id` matches the path parameter.                                                                               |
| `DELETE` | `/api/favorites/:userId/:recipeId` | Deletes the row matching both `user_id` and integer `recipe_id`.                                                                                |

The POST route returns `400` when a required field is missing. Unexpected favorite-route errors return `500` with `{ "error": "Something went wrong" }`.

### Database schema

The `favorites` table contains `id` (serial primary key), required `user_id` (text), `recipe_id` (integer), and `title` (text), plus optional `image`, `cook_time`, and `servings` text columns. `created_at` is a timestamp defaulting to `now()`. No foreign keys, unique constraints, or row-level security policies are defined. The checked-in migration is `0000_cloudy_runaways.sql`.

## 📁 Project Structure

```text
backend/
├── package.json                 # Dependencies and start/dev scripts
├── package-lock.json            # npm lockfile
├── drizzle.config.js            # Drizzle Kit PostgreSQL configuration
├── .env                         # Local environment values
├── documentation/               # Backend API documentation asset
└── src/
    ├── server.js                # Express app and API routes
    ├── config/
    │   ├── env.js               # Environment loading and defaults
    │   ├── db.js                # Neon and Drizzle client
    │   └── cron.js              # Optional keep-alive job
    └── db/
        ├── schema.js            # Favorites table definition
        └── migrations/          # SQL migration and Drizzle metadata
```

## Development

From `backend/`:

```bash
npm install
npm run dev
npm start
```

Set `DATABASE_URL` before starting. No test command is declared in `package.json`.

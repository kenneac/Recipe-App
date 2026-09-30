# Recipe App

## Summary

Recipe App consists of an Express backend and an Expo/React Native mobile application. The backend stores user favorites in PostgreSQL, while the mobile app authenticates users with Clerk, browses recipe data from TheMealDB, and uses the backend to persist favorites.

JavaScript, TypeScript, Node.js, Express, Expo, React Native, Expo Router, Clerk Expo, TheMealDB, Drizzle ORM, Drizzle Kit, Neon Serverless, PostgreSQL, dotenv, cron, Nodemon, EAS, npm

## Backend Documentation

### Summary

The backend is an Express API that stores and retrieves a signed-in user's favorite recipes in PostgreSQL. It exposes a health check and favorite operations for the mobile app, using Neon and Drizzle ORM for database access.

JavaScript, Node.js, Express, Drizzle ORM, Drizzle Kit, Neon Serverless, PostgreSQL, dotenv, cron, Nodemon, npm

### Functions / Features

- ❤️ Add a recipe to a user's favorites
- 📚 List all favorites for a user
- 🗑️ Remove a specific recipe from a user's favorites
- 🩺 Provide an API health check
- ⏱️ Define an optional keep-alive cron job; it is currently disabled

### Technologies and Their Functions

- 🟨 **JavaScript / Node.js**: Runs the ES module backend.
- 🚂 **Express 5.2.1**: Provides the HTTP server, JSON parsing, and API routes.
- 🐘 **PostgreSQL**: Database dialect for the schema and migration.
- 🌐 **Neon Serverless 1.1.0**: Provides the PostgreSQL client.
- 🧱 **Drizzle ORM 0.45.2**: Defines the schema and executes database queries.
- 🛠️ **Drizzle Kit 0.31.11**: Configures PostgreSQL migration files.
- 🔐 **dotenv 17.4.2**: Loads environment variables.
- ⏲️ **cron 4.4.0**: Defines the optional fourteen-minute keep-alive job.
- 🔄 **Nodemon 3.1.14**: Restarts the development server.
- 🌍 **cors 2.8.6**: Declared in the backend manifest, but not imported by current source.

#### Backend environment and API

`PORT` defaults to `5001`; `DATABASE_URL` supplies the Neon/PostgreSQL connection; `NODE_ENV` is read by the commented cron startup condition; and `API_URL` is read by the optional cron job. Values are not reproduced here.

| Method   | Route                              | Behavior                                                                                          |
| -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/health`                      | Returns `{ "success": true }`.                                                                    |
| `POST`   | `/api/favorites`                   | Requires `userId`, `recipeId`, and `title`; accepts optional `image`, `cookTime`, and `servings`. |
| `GET`    | `/api/favorites/:userId`           | Lists favorites for one user.                                                                     |
| `DELETE` | `/api/favorites/:userId/:recipeId` | Removes one favorite by user and recipe ID.                                                       |

The `favorites` table has required `id`, `user_id`, `recipe_id`, and `title` columns; optional `image`, `cook_time`, and `servings`; and a `created_at` timestamp defaulting to `now()`. No foreign keys, unique constraints, or row-level security policies are defined.

### 📁 Project Structure

```text
backend/
├── package.json                 # Dependencies and npm scripts
├── package-lock.json
├── drizzle.config.js            # Drizzle Kit configuration
├── .env                         # Local environment values
└── src/
    ├── server.js                # Express server and routes
    ├── config/                  # Environment, database, and optional cron setup
    └── db/                      # Schema and checked-in PostgreSQL migration
```

### Backend Development

```bash
cd backend
npm install
npm run dev
```

Use `npm start` for the non-watch server command. No backend test command or migration npm script is declared.

## Mobile Documentation

### Summary

The mobile application is a portrait-oriented Expo app for discovering recipes, searching by name or ingredient, viewing recipe details and instructions, and saving favorites. Clerk protects authenticated routes, TheMealDB supplies recipe and category data, and the hosted backend stores favorites.

TypeScript, JavaScript, React, React Native, Expo, Expo Router, Clerk Expo, TheMealDB, Expo Image, Expo Linear Gradient, React Native WebView, Expo Secure Store, Expo Vector Icons, React Native Reanimated, React Native Gesture Handler, React Native Safe Area Context, React Native Screens, React Native Web, EAS, TypeScript compiler, npm

### Functions / Features

- 🔐 Email/password sign-in and account creation through Clerk
- ✉️ Email verification during sign-up
- 🛡️ Sign-in second-factor and device-trust verification for supported Clerk factors
- 🍽️ Browse featured, random, and category-filtered recipes
- 🔎 Search recipes by name, then fall back to ingredient search
- 📖 View recipe details, ingredients, instructions, cuisine area, cooking time, servings, and an embedded YouTube video when available
- ❤️ Save and remove recipes from a personal favorites list
- 🚪 Sign out from the Favorites screen
- 🔄 Refresh the home recipe feed with pull-to-refresh
- 📱 Run the Expo app on Android, iOS, or web through declared scripts

### Technologies and Their Functions

- ⚛️ **React 19.2.3** and **React Native 0.86.3**: Provide the component model and cross-platform UI.
- ⚡ **Expo 57.0.25**: Supplies the app runtime and development commands.
- 🧭 **Expo Router 57.0.23**: Provides file-based routing, protected route groups, tabs, and the recipe detail route.
- 🔑 **Clerk Expo 4.7.1**: Provides authentication, verification, session, and sign-out flows.
- 🗄️ **Expo Secure Store 57.0.4**: Is configured as a plugin and used by Clerk's token cache.
- 🍲 **TheMealDB HTTP API**: Supplies categories, random meals, searches, ingredient filters, and full meal details.
- 🖼️ **Expo Image 57.0.5**: Loads recipe and local images.
- 🌈 **Expo Linear Gradient 57.0.2**: Renders recipe image overlays and detail gradients.
- ▶️ **React Native WebView 13.16.1**: Embeds available YouTube recipe videos.
- 🎨 **Expo Vector Icons 15.0.2**: Supplies Ionicons.
- 🧩 **React Native Gesture Handler 2.32.0**, **React Native Reanimated 4.5.1**, and **React Native Worklets 0.10.1**: Installed interaction and animation dependencies.
- 🧱 **React Native Safe Area Context 5.7.0**: Provides safe-area insets through `SafeScreen`.
- 🖥️ **React Native Screens 4.26.0**: Provides installed native screen support.
- 🌐 **React Native Web 0.21.0** and **React DOM 19.2.3**: Support the configured web target.
- 🔗 **Expo Linking 57.0.11**, **Expo Web Browser 57.0.3**, and **Expo Constants 57.0.19**: Provide installed Expo platform integrations.
- 🧰 **Expo UI 57.0.20**, **Expo Device 57.0.2**, **Expo Font 57.0.4**, **Expo Glass Effect 57.0.4**, **Expo Splash Screen 57.0.9**, **Expo Status Bar 57.0.1**, **Expo Symbols 57.0.3**, and **Expo System UI 57.0.4**: Provide declared Expo runtime/configuration modules.
- 🟦 **TypeScript 6.0.3**: Type-checks the TypeScript and JavaScript project.
- 🏗️ **EAS**: `eas.json` defines development, preview, and production build profiles plus production submission configuration.
- 📦 **npm**: Installs dependencies and runs package scripts.

#### Mobile environment, services, and routes

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is required by `src/app/_layout.tsx`; the app throws an error when absent.
- TheMealDB uses `https://www.themealdb.com/api/json/v1/1`.
- Favorites use `https://recipe-app-lrg5.onrender.com/api`, defined in `src/constants/api.js`.
- `src/app/_layout.tsx` wraps the app in Clerk and protects auth and signed-in route groups.
- `src/app/(auth)/` contains sign-in, sign-up, email verification, and sign-in verification screens.
- `src/app/(tabs)/` contains Recipes, Search, and Favorites tabs.
- `src/app/recipe/[id].jsx` displays recipe details for a meal ID.

#### Mobile commands

```bash
cd mobile
npm install
npm start
npm run android
npm run ios
npm run web
npm run lint
```

The manifest also declares `npm run reset-project`, which invokes `scripts/reset-project.js`; that script is not present in the checked-in mobile file tree. No test script is declared.

### 📁 Project Structure

```text
mobile/
├── package.json                 # Expo dependencies and scripts
├── package-lock.json            # npm lockfile
├── app.json                     # Expo identity, platforms, plugins, and typed routes
├── eas.json                     # EAS build and submit profiles
├── tsconfig.json                # Strict TypeScript config, aliases, and JS support
├── assets/
│   ├── images/                  # App, auth, food, and platform image assets
│   ├── fonts/                   # Bundled font asset
│   └── styles/                  # Screen and component StyleSheet definitions
└── src/
    ├── app/                     # Expo Router layouts and screens
    ├── components/              # Recipe cards, filters, loading, empty, and safe-area components
    ├── constants/               # Backend URL and active color theme
    ├── hooks/                   # Search debounce hook
    └── services/                # TheMealDB client and meal transformation logic
```

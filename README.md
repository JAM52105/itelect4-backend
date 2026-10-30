[![CI](https://github.com/JAM52105/itelect4-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/JAM52105/itelect4-backend/actions/workflows/ci.yml)

# ITELEC4 Backend

Express and MongoDB API for the ITELEC4 campus learning project.

## Live deployments
- Backend API: https://jam52105-itelect4-backend.vercel.app
- Health check: https://jam52105-itelect4-backend.vercel.app/api/health
- Frontend: https://itelec-4-project.vercel.app

## Repositories
- Backend: https://github.com/JAM52105/itelect4-backend
- Frontend: https://github.com/JAM52105/ITELEC4-Project

## Run locally
1. Install dependencies with `npm install`.
2. Set `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, and `GEMINI_API_KEY` in `.env`.
3. Seed the reference courses with `npm run seed`.
4. Start the development server with `npm run dev`.

The API runs on `http://localhost:4000` by default. Public course endpoints are
available at `/api/courses`; authentication and item, claim, and submission
endpoints are under `/api`. The authenticated AI project review endpoint is
available at `POST /api/ai`.

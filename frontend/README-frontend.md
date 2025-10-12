# My Cloud — Frontend

## Run dev
npm install
npm run dev

## Build
npm run build

## Tests
npm run test

API base is set by VITE_API_BASE env var (default http://localhost:8000/api)

CSRF:
This frontend reads cookie `csrftoken` and sends `X-CSRFToken` for non-GET requests.


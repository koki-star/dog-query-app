# Dog Query App

College assignment (Application Development, North Seattle College). A React app that browses dog breeds from the Dog API using TanStack Query. You can search the breed list, open one breed for details, and see dog facts and groups on the same page.

Live demo: https://koki-star.github.io/dog-query-app/

The point of the assignment was handling request states, so the app shows loading, success, empty, and error states clearly.

## Run it

The app is served from `/dog-query-app/` (set in `vite.config.js`), so the local dev server opens at `http://localhost:5173/dog-query-app/`.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Built with

- React and Vite
- TanStack Query for API requests and caching
- Dog API (https://dogapi.dog), no API key needed

## Features

- Full breed list from `/breeds` (all pages are loaded) with a search filter
- Breed details from `/breeds/{id}`
- Dog facts from `/facts` and groups from `/groups`
- Loading, empty, and error states for each request
- A test cases section in the interface that triggers those states by hand, including a deliberate bad request

## Project structure

```text
dog-query-app/
├── src/
│   ├── api/
│   │   └── dogApi.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

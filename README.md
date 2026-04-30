# Dog Query App

A small React app that uses the Dog API with TanStack Query.

This project lets you browse dog breeds, open details for a selected breed, and view extra dog facts and groups in one place. It focuses on clear loading, success, empty, and error states so the data flow is easy to follow.

## Run

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

## About

- Built with React and Vite
- Uses TanStack Query for API requests and query state
- Fetches data from the Dog API
- Includes a small test cases section for normal and edge case states

## Features

- Breeds list from `/breeds`
- Breed detail from `/breeds/{id}`
- Dog facts from `/facts`
- Dog groups from `/groups`
- Loading, error, and success states
- Search filter for the breeds list
- Test cases section with normal and edge case states

## Project Structure

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

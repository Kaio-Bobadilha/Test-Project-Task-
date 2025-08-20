# Test-Project-Task-
Project for a Job Test
---------------------------------------------------------

# Amazon Product Scraper

This project consists of a backend API built with Bun and Express to scrape Amazon search results, and a frontend built with HTML, CSS, and Vanilla JavaScript using Vite to interact with the API.

## Features
- Backend: Fetches and parses the first page of Amazon search results for a given keyword, extracting product title, rating, number of reviews, and image URL.
- Frontend: Simple UI to input a keyword, trigger the scrape, and display results in a clean format.
- Error handling: Graceful handling of missing keywords, network errors, and scraping failures.

## Prerequisites
- Bun[](https://bun.sh) installed for running the backend and frontend.

## Setup and Running Instructions

### Backend
1. Create a `backend` directory and place `server.js` in it.
2. Navigate to the `backend` directory: cd backend
3. Install dependencies: bun add express axios jsdom cors
4. Run the server: bun server.js

The API will be available at `http://localhost:3000`.

### Frontend
1. Create a `frontend` directory.
2. Initialize a Vite project (vanilla template):
- cd frontend
- bun create vite
- Overwrite or manually add `index.html`, `style.css`, and `main.js` from above.
  
3. Install dependencies (if needed, Vite adds them automatically):
   - bun install
4. Run the development server:
  - bunx vite

The frontend will be available at `http://localhost:5173` (default Vite port).

## Usage
1. Start the backend server.
2. Open the frontend in a browser.
3. Enter a keyword (e.g., "laptop") in the input field and click "Search".
4. Results will display below, showing product cards with images and details.

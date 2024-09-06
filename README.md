
A simple URL shortener and tracking service built using Node.js, Express, MongoDB, and Mongoose. This application shortens long URLs and tracks the number of clicks with optional usage limits.

## Features
- Shortens long URLs to a shortened format.
- Tracks click counts on shortened URLs.
- Limits the number of uses for shortened URLs (optional).
- Redirects to the original URL after click tracking.
- Stores URL data in MongoDB Atlas.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using MongoDB Atlas)
- **Utilities**: Crypto (for hashing URLs), CORS
- **Dev Tool**: Nodemon (for development)

## File Structure
```
📦URLShortener
 ┣ 📂controller
 ┃ ┗ 📜urlController.js          # Handles URL shortening and redirection logic
 ┣ 📂models
 ┃ ┗ 📜Url.js                    # Mongoose schema for URL data
 ┣ 📂routes
 ┃ ┗ 📜urlRoutes.js              # URL routing logic (POST for shortening, GET for redirection)
 ┣ 📂utils
 ┃ ┗ 📜hashUtils.js              # Utility functions for URL hashing and generating short URLs
 ┣ 📜index.js                    # Main server file, connects to MongoDB, and registers routes
 ┣ 📜package.json
 ┗ 📜README.md                   # Project documentation
```

## Prerequisites
- [Node.js](https://nodejs.org/en/) (v14.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
- [Nodemon](https://nodemon.io/) (for development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory for environment variables:
   ```bash
   touch .env
   ```

4. Add your MongoDB Atlas connection string and port to `.env`:
   ```
   PORT=3000
   DatabaseUrl=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<your-db-name>?retryWrites=true&w=majority
   ```

5. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reloading:
   ```bash
   npm run dev
   ```

## Usage

### 1. Shorten a URL
- **POST** `/url`
  - Body: `{ "url": "https://example.com", "usesRemaining": 5 }` (optional `usesRemaining`)
  - Response: `{ "shortUrl": "http://localhost:3000/url/abc12345" }`

Example request:
```bash
curl -X POST http://localhost:3000/url \
-H "Content-Type: application/json" \
-d '{"url": "https://example.com", "usesRemaining": 3}'
```

### 2. Redirect and Track Clicks
- **GET** `/url/:shortUrl`
  - Redirects to the original URL.
  - Increments click count.
  - Returns an error if the usage limit is reached.

Example request:
```bash
curl http://localhost:3000/url/abc12345
```

### 3. MongoDB Schema
The MongoDB schema stores:
- `hashedUrl`: The hashed version of the original URL.
- `shortUrl`: The shortened URL (first 8 characters of the hash).
- `originalUrl`: The original URL provided by the user.
- `clicks`: Number of times the shortened URL was accessed.
- `usesRemaining`: Number of times the URL can be used.

## Environment Variables
Make sure to configure the following environment variables in your `.env` file:
- `PORT`: The port number on which the server should run.
- `DatabaseUrl`: The MongoDB connection string (Atlas or local MongoDB).

## Running Tests
To be added in future versions.

## Future Improvements
- Add user authentication for URL management.
- Implement analytics dashboards for tracking click trends.
- Add custom short URLs.

## License
This project is licensed under the MIT License.
```

## Author
- **Your Name** - [your-github](https://github.com/your-username)
```

## How to Use:
1. **Clone** this repository.
2. **Install** the dependencies using `npm install`.
3. **Create** a `.env` file with the MongoDB connection string.
4. **Run** the server using `npm start` for production or `npm run dev` for development.

The app will be available on `http://localhost:3000`. You can use the `/url` endpoint to shorten URLs and get a shortened URL for redirection.
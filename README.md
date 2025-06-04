## Features

- **URL-Shortener**: Returns 6 char shortened version of provided URL.
- **Short-URL-info**: Returns shortURL click count, created time and original URL.

## Tech Stack

- Nest.js, Typescript, Docker, Postresql

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd BE-3205
   ```

2. **Install**

   ```bash
   npm install
   ```

   ```bash
   docker compose up -d db
   docker compose build
   ```

3. **Run the backend server**

   ```bash
   npm run start
   ```

   ```bash
   docker compose up
   ```

4. **Backend Endpoints**

   ```bash
   POST /shorten: creates shortened URL.
     Query Parameters:
       originalUrl (string, required)

   GET /:shortUrl: returns originalUrl.

   GET /info/:shortUrl: returns information related to short URL.

   DELETE /delete/:shortUrl: deletes data related to shortURL.
   ```

5. **.env example**

   ```
   DB_TYPE=postgres
   PG_HOST=localhost
   PG_USER=postgres
   PG_PASSWORD=postgres
   PG_DB=postgres
   PG_PORT=5432
   ```

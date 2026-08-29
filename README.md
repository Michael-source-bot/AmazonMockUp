# Address signing page

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Confirm `.env` contains `FIREBASE_LINK` and `FIREBASE_SECRET`.
3. Start the site:
   ```bash
   npm run dev
   ```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The browser submits to the local Express API. The Firebase secret is only read by the server and is never exposed to the client.

For a production build:

```bash
npm run build
$env:NODE_ENV="production"; npm start
```

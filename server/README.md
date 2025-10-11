# Saudi Events - Backend (local dev)

This folder contains the Node/Express backend used by the tourism site. It's configured for local development and uses a JSON file database (`lowdb`) to avoid native build steps.

What changed recently
- The server now tolerates `multer` being absent: image upload endpoints become no-ops and the server will still start. If you need uploads, install `multer` manually (see below).

Quick start (Windows cmd.exe)

1) From the `server` folder, install dependencies:

```cmd
cd C:\Users\BROTHERS\Desktop\project\project\server
npm install
```

2) Start the server:

```cmd
npm start
```

The server listens on the port set in `PORT` env (default 4000). Key endpoints:
- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- GET /api/events
- POST /api/events  (org-only; image upload optional)
- PUT /api/events/:id (org-only; image upload optional)
- POST /api/events/:id/like
- POST /api/events/:id/save
- GET /api/events/saved
- POST /api/reservations

Image uploads (optional)

If `multer` is not installed, the POST/PUT event routes will accept requests but will not process an uploaded file (they will still create/update the event record). To enable real file uploads:

```cmd
npm install multer
```

If you previously saw `npm ERR! ETARGET` for `multer@^1.4.5`, installing the latest `multer` manually (as shown above) should work. If npm cache issues occur, try:

```cmd
npm cache clean --force
npm install multer
```

Uploaded files are saved to `server/uploads` and served at `/uploads/<filename>`.

Environment variables

Create a `.env` file in the `server` folder (or set env vars in your host) with at least:

```
PORT=4000
JWT_SECRET=your_jwt_secret_here
# Optional SMTP settings for sending emails
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=yourpassword
```

SMTP test script

I added a `.env.example` in this folder and a small test script you can use to verify real email sending:

1) Copy `.env.example` to `.env` and fill your SMTP values.

```cmd
copy .env.example .env
```

2) Run the test script (replace recipient@example.com):

```cmd
node tools/send_test_email.js recipient@example.com
```

If SMTP is configured correctly the script will send a real email; otherwise the send is simulated and printed in the server console.


Serving the frontend from the server

- The server is configured to serve the site's static files from the project root. That means if you start the server (see above) and open in your browser:

  http://localhost:4000/

  it should load the site's `index.html` instead of showing "Cannot GET /".

- If you change PORT when starting the server, replace 4000 with your PORT value in the URL above.

Notes
- The server uses `lowdb` (a JSON file) for local development. For production, migrate to a real DB.
- The code logs a warning if `multer` is missing, allowing the server to run without it.
- If you want, I can add a `.env.example` and a small smoke-test script invocation.

Troubleshooting
- If `npm install` previously failed due to a specific `multer` version not found, removing `multer` from `package.json` (already done) allows `npm install` to complete. Install `multer` manually only if you need uploads.
- If you still see "Cannot GET /":
  1) Make sure you started the server from the `server` folder with `npm start`.
  2) Confirm the server is listening (see the console message).
  3) If a different server is running on the same port, stop it or run this server on another port (see earlier instructions).

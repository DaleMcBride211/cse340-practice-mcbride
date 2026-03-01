import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { caCert } from './src/models/db.js';

import { setupDatabase, testConnection } from './src/models/setup.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';
import flash from './src/middleware/flash.js';

// 1. Import MVC components
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Improved environment detection
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

const app = express();

/**
 * RENDER FIX: Trust the proxy
 * Render uses a reverse proxy to handle HTTPS. Without this, 
 * Express will think the connection is insecure and refuse 
 * to send the session cookie.
 */
app.set('trust proxy', 1);

// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);

// Configure session middleware
app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: process.env.DB_URL,
            // Configure SSL for session store connection
            ssl: {
                ca: caCert,
                rejectUnauthorized: true,
                checkServerIdentity: () => { return undefined; }
            }
        },
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Only use secure cookies in production (HTTPS)
        secure: NODE_ENV === 'production', 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax' // Helps ensure flash messages persist across redirects
    }
}));

startSessionCleanup();

// --- Middleware Stack Order Matters ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Flash must come AFTER session
app.use(flash);

// Global variables must come AFTER flash (so res.locals.flash works)
app.use(addLocalVariables);

// 2. Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 3. Apply Routes
app.use('/', routes);

// 4. Error Handlers
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent || res.finished) return next(err);
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV
    });
});

app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on port: ${PORT}`);
});
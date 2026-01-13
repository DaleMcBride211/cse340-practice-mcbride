// 1. Imports
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';


// 2. Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 3. Configurations
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 4. Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase();
    // Continue to the next middleware or route handler
    next();
});

// 5. Routes
app.get('/', (req, res) => {
    
    const title = 'Home';
    res.render('home', {title}); 
});

app.get('/about', (req, res) => {
    const title = 'About Me'; 
    res.render('about', {title});
});

app.get('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', {title});
});

app.get('/student', (req, res) => {
    const title = 'Student';
    const student_info = {name: 'Dale McBride', id: '21005', email: 'mcb21005@byui.edu', address: '101 S Center St, Rexburg, ID 83460'};
    res.render('student', {title, student_info});
});


// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// 6. Start Server
app.listen(PORT, () => {
    console.log(`Web Server is listening at port ${PORT}`);
});
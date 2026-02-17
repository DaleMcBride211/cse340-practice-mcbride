import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage} from './faculty/faculty.js'; 
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import { Router } from 'express';


const router = Router();

router.use('/catalog', (req, res, next) => {
    console.log("LOG: Catalog styles are being added!");
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

router.use('/faculty', (req, res, next) => {
    console.log("LOG: Faculty styles are being added!");
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
    next();
});

router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

router.use('/contact', contactRoutes);

router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});
router.use('/register', registrationRoutes);

router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);
router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

// Login routes (form and submission)
router.use('/login', loginRoutes);
// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);


export default router;
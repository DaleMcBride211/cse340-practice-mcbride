const routes = require('express').Router();
const lesson1Controller = require('../controllers/lesson1');
routes.get('/', lesson1Controller.routeLesson1);

module.exports = routes;
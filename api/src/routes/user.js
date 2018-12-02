const router = require('express').Router();

const userController = require(__basedir + 'src/controllers/userController');
const authenticate = require(__basedir + 'src/middleware/authenticate');

// Create new user
router.post('/', userController.create);

// Log user in (POST method is used to prevent browser history to store user data)
router.post('/login', userController.login);

// Fetch user sites
router.get('/sites', authenticate, userController.fetchSites);

module.exports = router;
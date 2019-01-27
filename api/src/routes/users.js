const router = require('express').Router();

const userController = require(__basedir + 'src/controllers/user');
const auth = require(__basedir + 'src/middleware/auth');

// Create new user
router.post('/', userController.create);

// Log user in (POST method is used to prevent browser history to store user data)
router.post('/login', userController.login);

// Fetch user sites
router.get('/me/sites', auth, userController.fetchSites);

module.exports = router;
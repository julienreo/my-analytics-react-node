const router = require('express').Router();

const visitController = require(__basedir + 'src/controllers/visit');
const authenticate = require(__basedir + 'src/middleware/authenticate');

// Create new visit (GET method is used as client request is made from an img tag)
router.get('/create/:id', visitController.create);

// Fetch visits
router.get('/:id', authenticate, visitController.fetch);

module.exports = router;
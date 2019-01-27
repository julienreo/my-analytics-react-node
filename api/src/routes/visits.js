const router = require('express').Router();

const visitController = require(__basedir + 'src/controllers/visit');
const auth = require(__basedir + 'src/middleware/auth');

// Create new visit (GET method is used as client request is made from an img tag)
router.get('/create/:id', visitController.create);

// Fetch visits
router.get('/:id', auth, visitController.fetch);

module.exports = router;
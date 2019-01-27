const router = require('express').Router();

const visitController = require(__basedir + 'src/controllers/visit');
const authenticate = require(__basedir + 'src/middleware/authenticate');

// Fetch visits
router.get('/:id', authenticate, visitController.fetch);

module.exports = router;
const router = require('express').Router();

const visitController = require(__basedir + 'src/controllers/visitController');

// Create new visit (GET method is used as client request is made from an img tag)
router.get('/create/:id', visitController.create);

module.exports = router;
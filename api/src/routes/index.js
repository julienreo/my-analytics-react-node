const router = require('express').Router();

router.use('/users', require(__basedir + 'src/routes/users'));
router.use('/visits', require(__basedir + 'src/routes/visits'));

module.exports = router;
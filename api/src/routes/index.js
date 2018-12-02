const router = require('express').Router();

router.use('/user', require(__basedir + 'src/routes/user'));
router.use('/visit', require(__basedir + 'src/routes/visit'));
router.use('/visits', require(__basedir + 'src/routes/visits'));

module.exports = router;
const router = require('express').Router();
const { register, login, guest, google, me } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/guest', guest);
router.post('/google', google);
router.get('/me', protect, me);

module.exports = router;

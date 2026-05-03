const router = require('express').Router();
const { updateProfile, subscribe } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.post('/subscribe', protect, subscribe);

module.exports = router;

const router = require('express').Router();
const { getAll } = require('../controllers/template.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAll);

module.exports = router;

const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const sendAuth = (res, user, statusCode = 200) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isGuest: user.isGuest,
      isPremium: user.isPremium,
    },
  });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ email, password, name: name || '' });
    sendAuth(res, user, 201);
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    sendAuth(res, user);
  } catch (err) { next(err); }
};

// POST /api/auth/guest
exports.guest = async (req, res, next) => {
  try {
    const user = await User.create({ name: 'Guest', isGuest: true });
    sendAuth(res, user, 201);
  } catch (err) { next(err); }
};

// POST /api/auth/google
exports.google = async (req, res, next) => {
  try {
    const { email, name, avatarUrl, googleUid } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required from Google sign-in' });

    // Find existing user by email or create a new one
    let user = await User.findOne({ email });
    if (user) {
      // Update name and avatar if they were empty
      if (!user.name && name) user.name = name;
      if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
      if (!user.googleUid && googleUid) user.googleUid = googleUid;
      await user.save();
    } else {
      user = await User.create({
        email,
        name: name || '',
        avatarUrl: avatarUrl || '',
        googleUid: googleUid || '',
        isGuest: false,
      });
    }

    sendAuth(res, user, user.isNew ? 201 : 200);
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
      isGuest: req.user.isGuest,
      isPremium: req.user.isPremium,
    },
  });
};

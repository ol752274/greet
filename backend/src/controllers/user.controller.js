const User = require('../models/User');

// PUT /api/user/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const update = {};
    if (name) update.name = name;
    if (req.file) update.avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isGuest: user.isGuest,
        isPremium: user.isPremium,
      },
    });
  } catch (err) { next(err); }
};

// POST /api/user/subscribe  (mock payment)
exports.subscribe = async (req, res, next) => {
  try {
    const { planId } = req.body || {};
    // In production: verify Razorpay / Stripe payment signature here
    // planId would be 'monthly' or 'yearly'
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isPremium: true, premiumSince: new Date(), premiumPlan: planId || 'monthly' },
      { new: true }
    );
    res.json({
      message: 'Premium activated',
      isPremium: user.isPremium,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isGuest: user.isGuest,
        isPremium: user.isPremium,
      },
    });
  } catch (err) { next(err); }
};

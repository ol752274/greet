const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    avatarUrl: { type: String, default: '' },
    isGuest: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    premiumSince: { type: Date },
    premiumPlan: { type: String, enum: ['monthly', 'yearly'], default: null },
    googleUid: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);

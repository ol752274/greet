const TEMPLATES = [
  { id: 1, cat: 'Birthday', emoji: '🧁', label: 'Happy Birthday', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)', wish: 'Wishing you joy & love on your special day!', premium: false },
  { id: 2, cat: 'Birthday', emoji: '🎁', label: 'Party Time!', gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)', wish: 'Let the celebrations begin!', premium: false },
  { id: 3, cat: 'Birthday', emoji: '🪅', label: 'Surprise!', gradient: 'linear-gradient(135deg,#06b6d4,#22d3ee)', wish: 'You deserve all the happiness!', premium: true },
  { id: 4, cat: 'Birthday', emoji: '🎀', label: 'Sweet Day', gradient: 'linear-gradient(135deg,#e879f9,#fbbf24)', wish: 'Hope your day is as sweet as you!', premium: true },
  { id: 5, cat: 'Festival', emoji: '🕯️', label: 'Happy Diwali', gradient: 'linear-gradient(135deg,#ea580c,#facc15)', wish: 'May your life be filled with light!', premium: false },
  { id: 6, cat: 'Festival', emoji: '🎨', label: 'Holi Hai!', gradient: 'linear-gradient(135deg,#d946ef,#9333ea)', wish: 'May your life be colourful!', premium: false },
  { id: 7, cat: 'New Year', emoji: '🌟', label: 'Happy New Year', gradient: 'linear-gradient(135deg,#0f172a,#1e3a5f,#334155)', wish: 'May this year bring you joy!', premium: false },
  { id: 8, cat: 'New Year', emoji: '🍾', label: 'Cheers!', gradient: 'linear-gradient(135deg,#a16207,#eab308)', wish: 'To new beginnings!', premium: true },
  { id: 9, cat: 'Love', emoji: '💞', label: 'Anniversary', gradient: 'linear-gradient(135deg,#db2777,#9333ea)', wish: 'Every day with you is a gift.', premium: true },
  { id: 10, cat: 'Exam', emoji: '✏️', label: 'Good Luck!', gradient: 'linear-gradient(135deg,#059669,#34d399)', wish: 'You have worked hard. Go ace it!', premium: false },
  { id: 11, cat: 'Exam', emoji: '🎖️', label: 'Congratulations!', gradient: 'linear-gradient(135deg,#d97706,#fbbf24)', wish: 'Proud of you!', premium: false },
  { id: 12, cat: 'Wedding', emoji: '💒', label: 'Just Married', gradient: 'linear-gradient(135deg,#b45309,#fde68a)', wish: 'Wishing you a blissful life together!', premium: false },
  { id: 13, cat: 'Wedding', emoji: '🌺', label: 'Wedding Wishes', gradient: 'linear-gradient(135deg,#9333ea,#e879f9)', wish: 'May love light your way!', premium: true },
];

// GET /api/templates
exports.getAll = (req, res) => {
  const { cat } = req.query;
  const isPremium = req.user?.isPremium || false;
  let list = cat && cat !== 'All' ? TEMPLATES.filter(t => t.cat === cat) : TEMPLATES;
  // Mark which are locked for this user
  list = list.map(t => ({ ...t, locked: t.premium && !isPremium }));
  res.json(list);
};

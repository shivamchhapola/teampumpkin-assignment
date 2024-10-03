const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      if (!(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      return res.json({ token, userId: user._id });
    }

    user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

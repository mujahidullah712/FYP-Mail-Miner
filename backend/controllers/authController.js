const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { oauth2Client } = require('../utils/oauth2client');
const { syncEmailsInBackground } = require('./emailController');

exports.googleAuth = async (req, res) => {
  try {
    const code = req.query.code;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    let user = await User.findOne({ email: userInfo.data.email });

    if (!user) {
      user = await User.create({
        name: userInfo.data.name,
        email: userInfo.data.email,
        image: userInfo.data.picture,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT }
    );

    res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
});

    // Start background sync
    syncEmailsInBackground(user._id, tokens);

    res.status(200).json({ user });
  } catch (err) {
    console.error("Google Auth Error:", err?.response?.data || err.message || err);
    res.status(500).json({ message: 'Google auth failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
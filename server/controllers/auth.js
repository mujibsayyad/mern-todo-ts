const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

exports.signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(422).json({ message: 'Input fields are empty' });
  }

  // find user
  const foundUser = await User.findOne({ email: email });

  if (foundUser) {
    return res.status(422).json({ message: 'Email already in use' });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    let token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY, {
      expiresIn: '12h',
    });

    res.status(201).json({ userId: newUser.id, token: token });
  } catch (error) {
    console.log(error, 'could not create user');
    res
      .status(400)
      .json({ message: 'could not create user, please try again later.' });
  }
};

// login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ message: 'Login fields are empty' });
  }

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    return res
      .status(400)
      .json({ message: 'No account found with this email' });
  }

  try {
    const matchPassword = await bcrypt.compare(password, foundUser.password);

    if (!matchPassword) {
      return res.status(401).json({ message: 'Wrong password. Try Again' });
    }

    let token = jwt.sign({ userId: foundUser._id }, process.env.SECRET_KEY, {
      expiresIn: '12h',
    });

    res.status(201).json({ userId: foundUser._id, token: token });
  } catch (error) {
    console.log('🚀 exports.login= ~ error:', error);
  }
};

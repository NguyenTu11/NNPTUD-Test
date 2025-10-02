const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { username, fullName } = req.query;
  const query = { isDelete: false };
  if (username) query.username = { $regex: username, $options: 'i' };
  if (fullName) query.fullName = { $regex: fullName, $options: 'i' };
  const users = await User.find(query).populate('role');
  res.json(users);
});

router.post('/verify', async (req, res) => {
  const { email, username } = req.body;
  const user = await User.findOne({ email, username, isDelete: false });
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = true;
  await user.save();
  res.json({ message: 'User verified', user });
});

router.get('/username/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username, isDelete: false }).populate('role');
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDelete: false }).populate('role');
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isDelete: true });
  res.json({ message: 'Deleted' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password, isDelete: false });
  if (!user) return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
  user.loginCount += 1;
  await user.save();
  res.json({ message: 'Đăng nhập thành công', user });
});

module.exports = router;

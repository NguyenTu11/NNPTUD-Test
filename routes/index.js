var express = require('express');
var router = express.Router();
const User = require('../schemas/user');
const Role = require('../schemas/role');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const { username, fullName } = req.query;
  const query = { isDelete: false };
  if (username) query.username = { $regex: username, $options: 'i' };
  if (fullName) query.fullName = { $regex: fullName, $options: 'i' };
  const users = await User.find(query).populate('role');
  const roles = await Role.find({ isDelete: false });
  res.render('index', { title: 'Express', users, roles, username, fullName });
});

module.exports = router;

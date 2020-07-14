const router = require('express').Router();
const {
  models: { User },
} = require('../db');

// /unassigned
router.get('/unassigned', async (req, res, next) => {
  try {
    res.send(await User.findUnassigned());
  } catch (err) {
    next(err);
  }
});

router.get('/teachers', async (req, res, next) => {
  try {
    res.send(await User.findTeachers());
  } catch (err) {
    next(err);
  }
});

module.exports = router;

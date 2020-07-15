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

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).send(await User.create(req.body));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.update(req.body);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

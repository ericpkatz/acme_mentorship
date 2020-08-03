const router = require('express').Router();
const {
  models: { User },
} = require('../db');

/**
 * All of the routes in this are mounted on /api/users
 * For instance:
 *
 * router.get('/hello', () => {...})
 *
 * would be accessible on the browser at http://localhost:3000/api/users/hello
 *
 * These route tests depend on the User Sequelize Model tests. However, it is possible
 * to pass the bulk of these tests after having properly configured the User
 * model's name and userType fields.
 */

// Add your routes here:

// /api/users/unassigned
router.get('/unassigned', async (req, res, next) => {
  const users = await User.findAll({
    where: { mentorId: null, userType: 'STUDENT' },
  });
  // console.log(
  //   users.map((user) => ({ name: user.name, mentorId: user.mentorId }))
  // );
  res.send(users);
});

// /api/users/teachers
router.get('/teachers', async (req, res, next) => {
  const teachers = await User.findAll({
    where: {
      userType: 'TEACHER',
    },
    include: [
      {
        model: User,
        as: 'mentees',
      },
    ],
  });
  // console.log(
  //   teachers.map((teacher) => ({ name: teacher.name, mentees: teacher.mentees.length }))
  // );
  res.send(teachers);
});

router.delete('/:id', async (req, res, next) => {
  const id = +req.params.id;
  const user = await User.findByPk(id);
  // if (!user) return res.sendStatus(404);
  await user.destroy();
  res.sendStatus(204);
});

router.post('/', async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).send(newUser);
  // TODO: Make sure this isn't a test-passing answer:
  // res.status(201).send({
  //   name: 'Flip'
  // });
});

router.put('/:id', async (req, res, next) => {
  const id = +req.params.id;
  const foundUser = await User.findByPk(id);
  // if (!user) return res.sendStatus(404);
  const updatedUser = await foundUser.update(req.body);
  res.send(updatedUser);
});

module.exports = router;

# Checkpoint - Pillars (Express/Sequelize)


This checkpoint is primarily to help us understand how well you've absorbed the material covered so far. It covers the main backend libraries you've leaned in the curriculum so far: Express and Sequelize.

To this end — and perhaps it goes without saying — we ask that you don't help each other or cheat.

## Resources

[FSA Checkpoint Academic Integrity Policy](https://gist.github.com/short-matthew-f/2ef877e84d6624626ec4fcc5d899936b)

## Things we're checking

* Express App Structures
* Express Routing and Route Methods
* Sequelize Model Configuration
* Sequelize Hooks

## Starting

1. **Fork** this repo to your own GitHub
* Clone your fork to your local machine.
* Make sure your Postgres database is running!
* Create two databases:
  * Development Database: `createdb acme_mentorship_db`
  * Test Database: `createdb acme_mentorship_db_test`
* `npm install`
* You can run `npm run test-dev` which will run the test suite continuously (`npm test` runs the tests only once).
* In a separate terminal, you can run `npm run start-dev-seed` which will start [a development server on port 3000](http://localhost:3000). It will also re-seed the database with fresh data whenever you save a file. (If you'd rather not re-seed on every change, you can run `npm run start-dev` instead.)
* Start working through the tests in `test/`.  You have to mark them as active (from pending) by changing `xit` to `it`
* Read through the project structure. You'll be working exclusively in `server/db/User.js` and `server/routes/users.js`.
* Before the lunch break, do a `git commit -am "LUNCHTIME" && git push origin master`

## IMPORTANT TIPS FOR SUCCESS

* **READ ALL COMMENTS CAREFULLY.** Specs often assume you have read the comments.
* After you have correctly defined the User model's `name` and `userType` fields, you can probably run all the remaining model and route specs in *any order* (note, not 100% guaranteed). So if you get stuck, **move on and try some other specs**.
* You should `git commit` and `git push` very frequently — even for each passing spec if you like! This will prevent you from losing work.
* That this project includes some working front-end code in `client/index.js`, bundled with Webpack into `public/bundle.js`. You won't need to write any front-end code to pass the provided tests, but you are encouraged to read through that front-end code to understand how it uses axios to make requests of the back-end.
* If you are uncertain what a spec is doing or asking of you, or you've gotten stuck, *ask for help*. We may not be able to give you any hints, but you won't know if you don't ask, and sometimes the problem is technical rather than related to the checkpoint itself.
* Please don't submit `console.log`s and other debug code.

## Submitting

To submit your answers:

`git commit -am "submission for deadline" && git push`

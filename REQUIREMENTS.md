# Pillars Project

## Overview

You are the lead engineer for Acme Tutors, an educational services company. Your job is to complete a tutoring dashboard for students and mentors. You team has already built a fully-functional front-end, as well as test specs for all the required server-side business features. Your fullstack expertise is required to complete the app. Before getting started, please carefully review the expectations.

#### User Stories

This application is for registering Students and Teachers. When complete, you should be able to do all of the following in the browser:

* Ensure Users have a unique name and a userType corresponding to their student or teacher role
* View all Students
* View all Teachers
* View a specific User
* Add a user based on data submitted via form
* Edit a specific user based on data submitted via form
* Delete a specific user
    * Teachers with >= 3 mentees have tenure and may not be deleted
* Assign a mentee to a mentor
    * All mentees must be Students
    * All mentors must be Teachers
    * A Teacher may not be assigned a mentor

## Requirements

These feature requirements detailed below will serve as your primary source of truth for attempting the project. User Stories, as well as Test specs in `mocha` and `chai` are there to supplement your development process; however, your score will be based on the number of requirements implemented. ** Code that does not pass the related test specs, but still accomplishes the required feature will receive credit. **

Your final evaluation will be weighted as follows:

* Requirements score (75%)
* [Rubric score](https://docs.google.com/spreadsheets/d/1JctZDSVLImKT-sJ7BwhVPrHgZ17pRSuE0FhbLKLxsBs/edit?usp=sharing) (25%)
* Extra credit (10% max)


### FEATURES

#### Sequelize Model (12 total)

Complete the  `User` model with the following information:
  - Name Property
    - [ ] must be a string
    - [ ] may not be empty or null
    - [ ] must be unique

  - userType Property
    - [ ] must be a specific string: either "STUDENT" or "TEACHER"
    - [ ] must be STUDENT by default
    - [ ] may not be null

  - isStudent Property
    - [ ] a virtual method that returns a BOOLEAN, representing if the User is a STUDENT type

  - isTeacher Property
    - [ ] a virtual method that returns a BOOLEAN, representing if the User is a TEACHER type

  - Hooks
    - [ ] A STUDENT user may not have any assigned mentees
    - [ ] A STUDENT user may only be assigned to a mentor who is a TEACHER
    - [ ] A TEACHER user may not have a mentor
    - [ ] Any requests to delete a TEACHER type user with >= 3 mentees should throw an Error


#### Express Routes (5 total)

Complete the  `user` router with the following functionalities. Make sure you have completed at least the Name and userType properties in the model:

  - [ ] GET all Users who aren't assigned to a mentor (`http://localhost:3000/api/users/unassigned`)
  - [ ] GET all teacher users (`http://localhost:3000/api/users/teachers`)
  - [ ] DELETE a specific user by their ID (e.g, `http://localhost:3000/api/users/5`)
  - [ ] CREATE a specific user with information filled out in the form (`http://localhost:3000/api/users`)
  - [ ] UPDATE a specific user (by ID) with information filled out in the form (e.g, `http://localhost:3000/api/users/5`)

#### Extra Credit

Congrats! You have completed these essential API features! Don't forget to `git commit -m Completed Requirements`

For Extra Credit, we need to ensure the site is responsive, with a stunning User Experience. Feel free to edit the CSS in `public/assets/style.css`.

  - [ ] Layout is Responsive to viewports of any size (up to 5% EXC)
  - [ ] Layout is visually stunning, including colors, fonts, layout, and animations (up to 5% EXC)

### Grading Formula

```javascript

const getTotal = (rawExpressScore, rawSequelizeScore, rawRubricScore, rawExtraCredit, deductions) => {
  const totalExpressRequirements = rawExpressScore  / 5;
  const totalSequelizeRequirements = rawSequelizeScore  / 12;
  const totalRequirementScore = (totalExpressRequirements + totalSequelizeRequirements) * 0.75
  const totalRubricScore = ((rawRubricScore/48) * 100) * 0.25
  const totalExtraCredit = (rawExtraCredit) * 0.1

  const total = totalRequirementScore + totalRubricScore + totalExtraCredit - deductions
  return total
}
```
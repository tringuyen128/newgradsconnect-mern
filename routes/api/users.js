const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()

// route     POST api/users
// desc      Register user
// access    Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Enter a password with 6 or more characters').isLength({
      min: 6,
    }),
  ],

  (req, res) => {
    // if those above don't match then res error message
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    res.send('User route')
  }
)

module.exports = router

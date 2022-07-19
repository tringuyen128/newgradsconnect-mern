const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

const User = require('../../models/User')

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

  async (req, res) => {
    // if those above don't match then res error message
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      // see if the user exist
      let user = await User.findOne({ email })
      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exist' }] })
      }
      // get users avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })
      user = new User({
        name,
        email,
        avatar,
        password,
      })

      // encrypt password and save in database
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      await user.save()

      // return jsonwebtoken - used to login
      res.send('User registered')
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

module.exports = router

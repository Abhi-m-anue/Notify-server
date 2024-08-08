const express = require('express')
const router = express.Router();

const { signIn, signUp } = require("../controllers/auth");

router.route('/signin').post(signIn)
router.route('/signup').post(signUp)

module.exports = router
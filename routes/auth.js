const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback',passport.authenticate('google',{failureRedirct:'/'}),(req,res)=>{
  res.redirect('/dashboard')
})

// logout
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/')
})

module.exports = router;

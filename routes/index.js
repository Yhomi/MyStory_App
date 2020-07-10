const express = require('express');
const router = express.Router();
const {ensureAuth,ensureGuest} = require('../config/auth');

router.get('/', ensureGuest ,(req,res)=>{
  res.render('login',{
    layout:'login'
  })
})

router.get('/dashboard', ensureAuth, (req,res)=>{
   // console.log(req.user.displayName);
  res.render('dashboard',{name:req.user.lastName})
})

module.exports = router;

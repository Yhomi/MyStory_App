const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../config/auth');
const Story = require('../models/Story');

router.get('/add',ensureAuth, (req,res)=>{
  res.render('stories/add')
})

router.post('/add',ensureAuth, async (req,res)=>{
  // console.log(req.user.id);

  try {
        const story = await new Story({
          title:req.body.title,
          body:req.body.body,
          status:req.body.status,
          user:req.user.id
        })
        const savedStory = await story.save();
        res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.render('errors/500');
  }
})

module.exports = router;

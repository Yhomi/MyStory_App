const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../config/auth');
const Story = require('../models/Story');

router.get('/add',ensureAuth, (req,res)=>{
  res.render('stories/add')
})

// get a single story
router.get('/:id', ensureAuth,async (req,res)=>{
  try {
    const story = await Story.findById({_id:req.params.id}).populate('user').lean()
    if(!story){
      return res.render('errors/404')
    }else{
      res.render('stories/show',{story})
    }

  } catch (err) {
    console.error(err);
    res.render('errors/500')
  }
});

// get a users post
router.get('/user/:userId',ensureAuth, async (req,res)=>{
  try {
    const stories = await Story.find({
      user:req.params.userId,status:'public'
    }).populate('user').lean()
    res.render('stories/index',{stories})
  } catch (err) {
    console.error(err);
    res.render('errors/404')
  }
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
});

// fetch all Stories
router.get('/',ensureAuth, async (req,res)=>{
  try {
    const stories = await Story.find({status:'public'})
                                .populate('user')
                                .sort({created_at:'desc'})
                                .lean()
    res.render('stories/index',{stories})
  } catch (err) {
    console.error(err);
    res.render('errors/500')
  }
});


// edit page
router.get('/edit/:id',ensureAuth, async (req,res)=>{
  const story = await Story.findById({_id:req.params.id}).lean()
  if(!story){
    return res.render('errors/404')
  }
  if(story.user != req.user.id){
    res.redirect('/stories')
  }else{
    res.render('stories/edit',{story})
  }
})

//update story
router.put('/:id',ensureAuth,async (req,res)=>{
  const story = await Story.findById({_id:req.params.id})
  if(!story){
    return res.render('errors/404')
  }

  if(story.user != req.user.id){
    res.redirect('back')
  }else{
    const updateStory = await Story.findOneAndUpdate({_id:req.params.id},req.body,{
      new:true,
      runValidators:true
    })
    res.redirect('/dashboard')
  }
});

// delete Story
router.delete('/delete/:id',ensureAuth, async (req,res)=>{
  const story = await Story.findById({_id:req.params.id})
  if(!story){
    return res.render('errors/404');
  }

  if(story.user != req.user.id){
    res.redirect('back')
  }else{
    const deleteStory = await Story.remove({_id:req.params.id})
    res.redirect('/dashboard')
  }
})


module.exports = router;

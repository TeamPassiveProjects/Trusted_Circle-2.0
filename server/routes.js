var router = require('express').Router();
var controller = require('./controllers');
var passport = require('passport');
var path = require('path');

router.get('/test', function(req,res) {
  console.log('yuri is gay')
  res.send()
})

//'/api/signup
router.get('/signup', controller.signup.get);
// router.get('/trains', controller.train.get);
// router.get('/gettrainsongs', controller.train.get);
// router.get('/trainsbytag', controller.tags.get);

router.get('/logout', (req, res) => {
    console.log('logged user out');
    req.logout();
});

// router.post('/addsongtotrain', controller.song.post);
// router.post('/addtrain', controller.train.post);
// router.post('/favtrain', controller.favTrain.post);
// router.post('/hypemSongs', controller.findHypemSongs.post);
router.post('/signup', controller.signup.post);
router.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
        res.status(400);
        return res.send('false'); 
    }

    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.send(user);
    });

  })(req, res, next);

});


module.exports = router;
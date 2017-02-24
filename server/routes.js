var router = require('express').Router();
var controller = require('./controllers');
var passport = require('passport');
var path = require('path');
var bluebird = require('bluebird');

const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

const Chatrooms = require('../models/chatrooms.model');
const User = require('../models/users.model');
const Topic = require('../models/topics.model');
const Circle = require('../models/circles.model');
const User_Circles = require('../models/user_circle.model');
const Message = require('../models/messages.model');
const User_Topics = require('../models/user_topic.model');

router.get('/test', function(req,res) {
  console.log('yuri is gay')
  res.send()
})

//'/api/signup
// var Message = require('../models/message');
router.get('/signup', controller.signup.get);
// router.get('/trains', controller.train.get);
// router.get('/gettrainsongs', controller.train.get);
// router.get('/trainsbytag', controller.tags.get);

router.get('/logout', (req, res) => {
    console.log('logged user out');
    req.logout();
});

router.get('/users', (req, res) => {
    console.log('getting users');
    User.findAll().then( (data) => {
        res.send(data)
    })
})

router.get('/users/:username', (req, res) => {
    console.log('getting specific user');
    console.log(req.params.username);

    User.findAll({
    where: {
        username: req.params.username
     }
    }).then( (data) => {
        res.send(data)
    })
})

router.get('/user/:id', (req, res) => {
    console.log('getting specific user');
    console.log(req.params);

    User.find({
    where: {
        id: req.params.id
     }
    }).then( (data) => {
        res.send(data)
    })
})

router.get('/users_circles', (req, res) => {
    console.log('getting users circles');
    User_Circles.findAll().then( (data) => {
        res.send(data)
    })
})

router.get('/get_users_circles/:circleId', (req, res) => {
    console.log(req.params.circleId, 'this is circle Id!');
    console.log('getting users of a circle !!!!');
    User_Circles.findAll({
        where: {
            circleId: req.params.circleId
        }
    }).then( (data) => {
        var arrUsers = [];
        data.forEach( (val, i) => {
            arrUsers.push(val.dataValues.userId);
        })
        console.log(arrUsers);
        return arrUsers;
    }).then( (arrUsers) => {
        User.findAll({
        where: {
            id: arrUsers
        }
        }).then( (dataUsers) => {
        
        
        res.send(dataUsers);
        })
    })
})

router.get('/users_topics', (req, res) => {
    console.log('getting users topics');
    User_Topics.findAll().then( (data) => {
        res.send(data)
    })
})

router.get('/roomList', (req, res) => {
    console.log('/roomlist being hit!!!')
    
    Chatrooms.findAll().then( (val) => {
            res.send(val) 
    })
  

});

router.get('/circles', (req, res) => {
    console.log('/circles being hit!!! for GET');
    console.log(req.params);
    
    Circle.findAll().then( (val) => {
            res.send(val) 
    })
  

});

router.get('/circles/:circleName', (req, res) => {
    console.log('/circlesName being hit!!! for GET');
    console.log(req.params);
    
    Circle.findAll({
        where: {
            name: req.params.circleName
        }
    }).then( (val) => {
            console.log(val);
            
            res.send(val) 
    })
  

});


//ROUTE TO FIND ALL THE CIRCLES THEY BELONG TO...
router.get('/userCircleTopic/:userId'
    // /:circleId/:topicId'
, (req, res) => {

    var userId = req.params.userId;

    // console.log('/circles being hit!!! for GET from param');
    // console.log(req.params);



    User.find({
        where: {
            id: userId
        }
    })
    .then( (userData) => {
        returnInfo.usernameData = userData
        return returnInfo
    })
    //Username has been Found [Step 2 Find the circles]
    .then( () => {
        //find all user_circle relationship [step 3 ]
        User_Circles.findAll({
            where : {
                userId: userId
            }
        }).then( (uCircleData) => {
            // console.log(uCircleData, 'this is user circle data');
            returnInfo.user_circles_Obj = uCircleData;
            for( obj of uCircleData ) {
                // console.log(obj.dataValues, '------------------0----------------');
                returnInfo.circleId.push(obj.dataValues.circleId);
            }
            // res.send(returnInfo); check getting all the circles
            return returnInfo
        }).then( ()=> {
            //I HAVE CIRCLE IDS from here
            //FIND ALL CIRCLES

            Circle.findAll({
                where: {'id': returnInfo.circleId }
            }).then( (circleData) => {
                // console.log(circleData, '---------1---------')
                for(cir of circleData) {
                    // console.log(cir.dataValues,'------2------');
                    returnInfo.circlesObj.push(cir.dataValues);
                }
                // returnInfo.circlesObj.push(circleData.dataValues);
                // res.send(returnInfo)
                // returnInfo;
                returnInfo
            }).then( () => {
                //FINDING CIRCLES AND TOPICS
                Topic.findAll({})
                .then ( (topicInfo) => {
                    for(topic of topicInfo) {
                        // console.log(topic.dataValues,'------2------');
                        for(cirId of returnInfo.circleId) {
                            if(cirId === topic.dataValues.circleId) {
                                returnInfo.topicId.push(topic.dataValues.id);
                                returnInfo.topicsObj.push(topic.dataValues);
                            }
                        }

                    }
                //WORK IN HERE

                return returnInfo
                }).then( () => {
                for(circlesData of returnInfo.circlesObj) {
                    for(topicsData of returnInfo.topicsObj) {
                        if(circlesData.id === topicsData.circleId) {
                            if(returnInfo.circles_topics[circlesData.id]) {
                                returnInfo.circles_topics[circlesData.id].push (topicsData)
                            } else {
                                returnInfo.circles_topics[circlesData.id] = [];
                                returnInfo.circles_topics[circlesData.id].push (topicsData);
                            }
                        }
                    }
                }

                
                return returnInfo
                // res.send(returnInfo)
                }).then( () => {
                        User_Topics.findAll()
                        .then( (data) => {
                            // console.log(data, 'this is Data');
                            
                            var dataArray = data;
                            for( topics of dataArray) {
                                console.log(topics.dataValues);
                                returnInfo.users_topicsALL.push(topics.dataValues);
                            }
                            res.send(returnInfo)
                        })

                    
                })


            })
            
            

        })

    })

    var returnInfo = {
        userId: userId,
        user_circles_Obj: [],
        circlesObj: [],
        circleId: [],
        topicsObj: [],
        topicId: [],
        circles_topics: {},
        users_topicsALL: []
    };


    // res.send(returnInfo)

})


router.get('/circles/:id', (req, res) => {
    console.log('/circles being hit!!! for GET from param');
    console.log(req.params);
    console.log(req.params.id);
    

  

});

router.get('/messages/:id', (req, res) => {
    console.log('/messages being hit!!! for GET from param');
    console.log(req.params);
    console.log(req.params.id);
    
    Message.findAll({
    where: {
        id: req.params.id
     }
    }).then( (val) => {
            res.send(val) 
    })
  

});

router.delete('/messages/:id', (req, res) => {

    console.log(req.params);
    console.log(req.params.id);
    Message.destroy({
        where: {
            id: req.params.id
        }
    }).then( val => {
        console.log(val);
        res.send('deleted amount:'+val)
    })
});



router.get('/topics', (req, res) => {
    console.log('/topics being hit!!! for GET')
    
    Topic.findAll().then( (val) => {
            res.send(val) 
    })
  

});

router.get('/topics/:id', (req, res) => {
    console.log('/topics being hit!!! for GET from param')
    console.log(req.params);
    console.log(req.params.id);
    
    Topic.findAll({
    where: {
        id: req.params.id
     }
    }).then( (val) => {
            res.send(val) 
    })
  

});


router.get('/messages', (req, res) => {
    Message.findAll().then( (val) => {
            res.send(val) 
    })
  });

router.post('/messages', (req, res) => {
    var body = req.body.body;
    var username = req.body.username;
    var userId = req.body.userId;
    console.log('this is data', req.body)
    let newMessage = {
        body: body,
        username: username,
        userId: userId

    }
    Message.create(newMessage).then(function (newMessage) {
        res.status(200).json(newMessage);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  })


router.post('/topics', (req, res) => {
    var body = req.body
    console.log('THIS IS BODY!!', body);
    // body = JSON.stringify(body)
    // res.send(body);
    let newTopic = {
        body: body.body,
        circleId: body.circleId
    }


    Topic.create(newTopic)
    .then( (data) => {
        // res.status(200).json(data);
        return data;
    }).then( (data) => {

        console.log(data.dataValues, ' DATATATATATATATATAATATA');

        User_Topics.create({
        status: "original poster",
        userId: body.userId,
        topicId: data.dataValues.id
        })
        .then( (data) => {
            res.status(200).json(data);
        })



    })

})


router.post('/circles', (req, res) => {
    var body = req.body
    console.log('THIS IS BODY of circles!!', body);
    // body = JSON.stringify(body)
    // res.send(body);
    let newCircle = {
        name: body.body,
        userId: body.userId,
        totalMembers: 1
    };


    Circle.create(newCircle)
    .then( (data) => {
        // res.status(200).json(data);
        return data;
    }).then( (data) => {

        console.log(data.dataValues, ' DATATATATATATATATAATATA');

        User_Circles.create({
        status: "member",
        userId: body.userId,
        circleId: data.dataValues.id
        })
        .then( (data) => {
            res.status(200).json(data);
        })



    })

})

router.patch('/messages/:id', (req, res) => {
    console.log("EDIT", req.params);
    console.log("EDIT",req.body);
    Message.update(req.body,{
        where: {
            id: req.params.id
        }
    }).then( val => {
        console.log(val);
    })
});

router.delete('/messages/:id', (req, res) => {
    console.log("req params", req.params);
    console.log("req params id",req.params.id);
    Message.destroy({
        where: {
            id: req.params.id
        }
    }).then( val => {
        console.log(val);
    })
});



router.post('/topics', (req, res) => {
    console.log('/topics posting!!! from backend')
    
    Topic.findAll().then( (val) => {
            res.send(val) 
    })

});

router.post('/poll', controller.poll.post) 

router.get('/votes', controller.vote.get)

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
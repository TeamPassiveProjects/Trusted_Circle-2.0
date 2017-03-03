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
const User_Message_Votes = require('../models/user_message_votes.model');
const Comment = require('../models/comment.model');




router.get('/signup', controller.signup.get);

router.get('/logout', (req, res) => {
  console.log('logged user out');
  req.logout();
});

router.get('/users', (req, res) => {
  console.log('getting users');
  User.findAll().then((data) => {
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
  }).then((data) => {
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
  }).then((data) => {
    res.send(data)
  })
})

router.get('/users_circles', (req, res) => {
  console.log('getting users circles');
  User_Circles.findAll().then((data) => {
    res.send(data)
  })
})

router.get('/get_users_circles/:circleId', (req, res) => {
  console.log(req.params.circleId, 'this is circle Id!');
  console.log('getting users of a circle !!!!');
  User_Circles.findAll({
    where: {
      circleId: req.params.circleId,
      status: {
        $ne: "blacklisted"
      },
      $and: {
        status: "member"
      }
    }

  }).then((data) => {
    var arrUsers = [];
    data.forEach((val, i) => {
      arrUsers.push(val.dataValues.userId);
    })
    console.log(arrUsers);
    return arrUsers;
  }).then((arrUsers) => {
    User.findAll({
      where: {
        id: arrUsers
      }
    }).then((dataUsers) => {


      res.send(dataUsers);
    })
  })
})

router.get('/get_users_non_circles/:circleId', (req, res) => {
  console.log(req.params.circleId, 'this is circle Id!');
  console.log('getting users of a circle !!!!');
  User_Circles.findAll({
    where: {
      circleId: req.params.circleId,
      status: {
        $ne: "blacklisted"
      }
    }
  }).then((data) => {
    var arrUsers = [];
    data.forEach((val, i) => {
      arrUsers.push(val.dataValues.userId);
    })
    console.log(arrUsers);
    return arrUsers;
  }).then((arrUsers) => {
    User.findAll({
        where: {
          id: {
            $notIn: arrUsers
          }
        }
      })
      .then((dataUsers) => {
        res.send(dataUsers);
      })
  })
})

router.get('/users_topics', (req, res) => {
  console.log('getting users topics');
  User_Topics.findAll().then((data) => {
    res.send(data)
  })
})

router.get('/roomList', (req, res) => {
  console.log('/roomlist being hit!!!')

  Chatrooms.findAll().then((val) => {
    res.send(val)
  })


});

router.get('/circles', (req, res) => {
  console.log('/circles being hit!!! for GET');
  console.log(req.params);

  Circle.findAll().then((val) => {
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
  }).then((val) => {
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
      .then((userData) => {
        returnInfo.usernameData = userData
        return returnInfo
      })
      //Username has been Found [Step 2 Find the circles]
      .then(() => {
        //find all user_circle relationship [step 3 ]
        User_Circles.findAll({
          where: {
            userId: userId
          }
        }).then((uCircleData) => {
          // console.log(uCircleData, 'this is user circle data');
          returnInfo.user_circles_Obj = uCircleData;
          for (obj of uCircleData) {
            // console.log(obj.dataValues, '------------------0----------------');
            returnInfo.circleId.push(obj.dataValues.circleId);
          }
          // res.send(returnInfo); check getting all the circles
          return returnInfo
        }).then(() => {
          //I HAVE CIRCLE IDS from here
          //FIND ALL CIRCLES

          Circle.findAll({
            where: {
              'id': returnInfo.circleId
            }
          }).then((circleData) => {
            // console.log(circleData, '---------1---------')
            for (cir of circleData) {
              // console.log(cir.dataValues,'------2------');
              returnInfo.circlesObj.push(cir.dataValues);
            }
            // returnInfo.circlesObj.push(circleData.dataValues);
            // res.send(returnInfo)
            // returnInfo;
            returnInfo
          }).then(() => {
            //FINDING CIRCLES AND TOPICS
            Topic.findAll({})
              .then((topicInfo) => {
                for (topic of topicInfo) {
                  // console.log(topic.dataValues,'------2------');
                  for (cirId of returnInfo.circleId) {
                    if (cirId === topic.dataValues.circleId) {
                      returnInfo.topicId.push(topic.dataValues.id);
                      returnInfo.topicsObj.push(topic.dataValues);
                    }
                  }

                }
                //WORK IN HERE

                return returnInfo
              }).then(() => {
                for (circlesData of returnInfo.circlesObj) {
                  for (topicsData of returnInfo.topicsObj) {
                    if (circlesData.id === topicsData.circleId) {
                      if (returnInfo.circles_topics[circlesData.id]) {
                        returnInfo.circles_topics[circlesData.id].push(topicsData)
                      } else {
                        returnInfo.circles_topics[circlesData.id] = [];
                        returnInfo.circles_topics[circlesData.id].push(topicsData);
                      }
                    }
                  }
                }


                return returnInfo
                // res.send(returnInfo)
              }).then(() => {
                User_Topics.findAll()
                  .then((data) => {
                    // console.log(data, 'this is Data');

                    var dataArray = data;
                    for (topics of dataArray) {
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
  }).then((val) => {
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
  }).then(val => {
    console.log(val);
    res.send('deleted amount:' + val)
  })
});



router.get('/topics', (req, res) => {
  console.log('/topics being hit!!! for GET')

  Topic.findAll().then((val) => {
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
  }).then((val) => {
    res.send(val)
  })
});

router.get('/topics_to_user/:topicsId', (req, res) => {
  //purpose to get topic owner


  console.log('/topics being hit!!! for GET from param')
  console.log(req.params);
  console.log(req.params.topicsId);

  User_Topics.find({
    where: {
      topicId: req.params.topicsId,
      status: "original poster"
    }
  }).then((val) => {
    console.log(val.dataValues);

    var userId = val.dataValues.userId;

    User.find({
      where: {
        id: userId
      }
    }).then((data) => {
      res.send(data);
    })

    // res.send(val) 
  })


});

router.get('/getMessagesAndVotes/:topicId', (req, res) => {
  console.log('hitting this, the end point is:', req.params)
  // var UserMessageVotes = sequelize.define('usermessagevotes', {
  //   userId: Sequelize.INTEGER,
  //   messageId: Sequelize.INTEGER
  // });

  var theArray = [];

  Message.findAll({
      order: 'votes DESC',
      where: {
        topicId: req.params.topicId
      },
      include: [
          {
              model: User,
              include: [
                  {
                      model: Comment
                  }
              ]
          }
        ]
    })
    .then((data) => {
      var sendMe = data.map((value, index, array) => {
        var messageInfoObj = value.dataValues;
                // console.log("MESSAGEINFOOBJJJJJJJJJ",messageInfoObj)

        return messageInfoObj;
      })

      console.log('==========', sendMe);


      var messageIndexArray = [];
      var messageIndexArrayObj = [];

      for (var message of sendMe) {
        messageIndexArrayObj.push(message);
        messageIndexArray.push(message.id);
      }

      console.log(messageIndexArrayObj);
      console.log(messageIndexArray);

      res.send(messageIndexArrayObj);

      // User_Message_Votes.findAndCountAll({
      //     where: {
      //       messageId: {
      //         $in: messageIndexArray
      //       }
      //     }
      //   }).then((stupidData) => {
      //     var countObj = {};

      //     for (var messageObj of stupidData.rows) {
      //       if (countObj[messageObj.dataValues.messageId]) {
      //         countObj[messageObj.dataValues.messageId]++;
      //       } else {
      //         countObj[messageObj.dataValues.messageId] = 1;
      //       }
      //     }
      //     return countObj;

      //   }).then((countObj) => {
      //     console.log('this is countObj!!!!!', countObj)
      //     console.log('this is messageIndexArrayObj', messageIndexArrayObj);

      //     var newCountObj = Object.assign({}, countObj);

      //     console.log('==========================', newCountObj, '========================',
      //       Object.keys(countObj).length)

      //     if (Object.keys(countObj).length !== 0) {
      //       console.log('got in here!====================')
      //       for (var targetObj of messageIndexArrayObj) {
      //         for (var indexThis in newCountObj) {
      //           if (indexThis === targetObj.id.toString() && !targetObj.voteCount) {
      //             targetObj.voteCount = newCountObj[indexThis];
      //           }

      //           if (!targetObj.voteCount) {
      //             targetObj.voteCount = 0;
      //           }


      //         }
      //       }
      //       console.log('finished with loop', messageIndexArrayObj);
      //     } else {
      //       console.log('got in here3333333')
      //       for (var targetObj of messageIndexArrayObj) {
      //         targetObj.voteCount = 0;
      //         console.log(targetObj, 'target OBJECT IS ===========');

      //       }

      //     }


      //     // console.log('should be changed!!!!!');
      //     // console.log(newCountObj);
      //     // console.log(messageIndexArrayObj, 'yoooooooooo');

    
      //   // .then(messageIndexArrayObj => {
      //   //   const resObj = messageIndexArrayObj.map(

      //   //   )
      //   })

        // .then((mang) => {
        //   console.log('return from message', messageIndexArrayObj)
        //   res.send(messageIndexArrayObj);
        // })


    })
})

// route.get('/getMessagesAndVotes/', (req,res) => {
//   Message.find({

//   })
// })

router.get('/getTopicmessages/:topicId', (req, res) => {
  console.log('======================IDX IS===================', req.params.topicId);

  Message.findAll({
    include: [User],
    order: 'votes DESC',
    where: {
      topicId: req.params.topicId
    }

  }).then(messages => {
    const resObj = messages.map(message => {
      return Object.assign({}, {
        body: message.dataValues.body,
        messageId: message.dataValues.id,
        topicId: message.dataValues.topicId,
        userId: message.dataValues.userId,
        votes: message.dataValues.votes,
        username: message.dataValues.user.dataValues.username
      })
    })
    console.log(resObj);
    res.send(messages)
  })
});

router.post('/messages', (req, res) => {
    var body = req.body.body;
    var votes = req.body.votes;
    var userId = req.body.userId;
    var topicId = req.body.topicId;
    console.log(req.body);
    let newMessage = {
        body: body,
        votes: votes,
        userId: userId,
        topicId: topicId
    }
    Message.create(newMessage).then(function (newMessage) {
        res.status(200).json(newMessage);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  })
  
router.get('/messagesvotes/:messageId/:userId', (req, res) => {		
     		
     var userId = req.params.userId;		
     var messageId = req.params.messageId;		
 		
 		
     User_Message_Votes.findAll({		
         where: {		
             userId: userId,		
             messageId: messageId		
         }		
     })		
     .then(function (data ) {		
         res.send(data);		
       })		
 		
   })

  router.post('/messagesvotes/', (req, res) => {

    var userId = req.body.userId
    var messageId = req.body.messageId
    var upvotedUserId;

    console.log('HAHAHAHAHAHAHA', req.body);

    User_Message_Votes.findOne({
      where:{
        userId: userId,
        messageId: messageId
      }
    }).then((data)=>{
      console.log('DATAAAAT FROM UMV', data);

      if(data === null){
        let newMessageVote = {
          userId: userId,
          messageId: messageId,
          vote: 'upvote'
        }
        Message.findOne({
          where:{
            id: messageId
          }
        }).then((data)=>{
          upvotedUserId = data.dataValues.userId
          data.updateAttributes({
            votes: (data.dataValues.votes + 1)
          }).then((data)=>{
            User.findOne({
              where:{
                id: data.dataValues.userId
              }
            }).then((data)=>{
              if(data.dataValues.username !== 'Anonymous'){
                data.updateAttributes({
                  upvotes: (data.dataValues.upvotes + 1)
                }).then((data)=>{
                  if(data.dataValues.upvotes >= 10){
                    data.updateAttributes({
                      trustedCounselor: true
                    })
                  }
                  User_Message_Votes.create(newMessageVote).then(function (newMessageVote) {
                    res.status(200).json(newMessageVote);
                  })
                  .catch(function (error){
                    res.status(500).json(error);
                  });
                })
              } else {
                User_Message_Votes.create(newMessageVote).then(function (newMessageVote) {
                  res.status(200).json(newMessageVote);
                })
                .catch(function (error){
                  res.status(500).json(error);
                });
              }
            })
          })
        })
      } else if(data.dataValues.vote === 'downvote'){
        data.destroy()
        Message.findOne({
          where:{
            id: messageId
          }
        }).then((data)=>{
          upvotedUserId = data.dataValues.userId
          data.updateAttributes({
            votes:(data.dataValues.votes + 1)
          }).then((data)=>{
            User.findOne({
              where:{
                id: data.dataValues.userId
              }
            }).then((data)=>{
              if(data.dataValues.username !== 'Anonymous'){
                data.updateAttributes({
                  upvotes: (data.dataValues.upvotes + 1)
                }).then((data)=>{
                  if(data.dataValues.upvotes >= 10){
                    data.updateAttributes({
                      trustedCounselor: true
                    })
                  }
                })
              }
            })
          })
        })
        res.send({
          voted:true
        })
      } else if(data.dataValues.vote === 'upvote'){
        res.send({
          alreadyUpVoted: true
        })
      }
    })
  })

// router.post('/messagesvotes/', (req, res) => {

//   var userId = req.body.userId
//   var messageId = req.body.messageId
//   console.log(req.body);
//   let newMessageVote = {
//     userId: userId,
//     messageId: messageId
//   }
//   User_Message_Votes.create(newMessageVote).then(function (newMessageVote) {
//       res.status(200).json(newMessageVote);
//     })
//     .catch(function (error) {
//       res.status(500).json(error);
//     });
// })

//     router.post('/messagesvotes/:id', (req, res) => {

//     var userId = req.body.userId;
//     var messageId = req.params.id;
//     console.log(req.body);
//     let newMessageVote = {
//         userId: userId,
//         messageId: messageId
//     }

//     User_Message_Votes.findOne({
//         userId: userId,
//         messageId: messageId
//     }).then(
//         function(usermessagevote) {
//             if(!usermessagevote) {
//                 return User_Message_Votes.create(newMessageVote).then(function (newMessageVote) {
//                     res.status(200).json(newMessageVote);
//                     })
//                     .catch(function (error){
//                     res.status(500).json(error);
//                     });
//             } else {
//                 return;
//             }
//         }
//     )

//   })

router.delete('/messagesvotes/:id/:uid', (req, res) => {
  console.log("req params", req.params);
  console.log("req params id", req.params.id);
  console.log("req params id", req.params.uid);
  var userId = req.params.uid
  var messageId = req.params.id
  var downvotedUserId;

    console.log('messagesvotes', req.body);

    User_Message_Votes.findOne({
      where:{
        userId: userId,
        messageId: messageId
      }
    }).then((data)=>{
      console.log('DATAAAAT FROM UMV', data);

      if(data === null){
        let newMessageVote = {
          userId: userId,
          messageId: messageId,
          vote: 'downvote'
        }
        Message.findOne({
          where:{
            id: messageId
          }
        }).then((data)=>{
          downvotedUserId = data.dataValues.userId
          data.updateAttributes({
            votes: (data.dataValues.votes - 1)
          }).then((data)=>{
            User.findOne({
              where:{
                id: data.dataValues.userId
              }
            }).then((data)=>{
              if(data.dataValues.username !== 'Anonymous'){
                data.updateAttributes({
                  upvotes: (data.dataValues.upvotes - 1)
                }).then((data)=>{
                  if(data.dataValues.upvotes < 10){
                    data.updateAttributes({
                      trustedCounselor: false
                    })
                  }
                  User_Message_Votes.create(newMessageVote).then(function (newMessageVote) {
                    res.status(200).json(newMessageVote);
                  })
                  .catch(function (error){
                    res.status(500).json(error);
                  });
                })
              } else {
                User_Message_Votes.create(newMessageVote).then(function (newMessageVote) {
                  res.status(200).json(newMessageVote);
                })
                .catch(function (error){
                  res.status(500).json(error);
                });
              }
            })
          })
        })
      } else if(data.dataValues.vote === 'upvote'){
        data.destroy()
        Message.findOne({
          where:{
            id: messageId
          }
        }).then((data)=>{
          downvotedUserId = data.dataValues.userId
          data.updateAttributes({
            votes:(data.dataValues.votes - 1)
          }).then((data)=>{
            User.findOne({
              where:{
                id: data.dataValues.userId
              }
            }).then((data)=>{
              if(data.dataValues.username !== 'Anonymous'){
                data.updateAttributes({
                  upvotes: (data.dataValues.upvotes - 1)
                }).then((data)=>{
                  if(data.dataValues.upvotes < 10){
                    data.updateAttributes({
                      trustedCounselor: false
                    })
                  }
                })
              }
            })
          })
        })
        res.send({
          voted: true
        })
      } else if(data.dataValues.vote === 'downvote'){
        res.send({
          alreadyDownVoted: true
        })
      }
    })
});

router.post('/edit', (req, res) => {
  var body = req.body
  console.log('THIS IS BODY!!', body);
  // body = JSON.stringify(body)
  // res.send(body);
  let newTopic = {
    
  }


  // Topic.create(newTopic)
  //   .then((data) => {
  //     // res.status(200).json(data);
  //     return data;
  //   }).then((data) => {

  //     console.log(data.dataValues, ' DATATATATATATATATAATATA');

  //     User_Topics.create({
  //         status: "original poster",
  //         userId: body.userId,
  //         topicId: data.dataValues.id
  //       })
  //       .then((data) => {
  //         res.status(200).json(data);
  //       })



  //   })

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
    .then((data) => {
      // res.status(200).json(data);
      return data;
    }).then((data) => {

      console.log(data.dataValues, ' DATATATATATATATATAATATA');

      User_Topics.create({
          status: "original poster",
          userId: body.userId,
          topicId: data.dataValues.id
        })
        .then((data) => {
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
    .then((data) => {
      // res.status(200).json(data);
      return data;
    }).then((data) => {

      console.log(data.dataValues, ' DATATATATATATATATAATATA');

      User_Circles.create({
          status: "member",
          userId: body.userId,
          circleId: data.dataValues.id
        })
        .then((data) => {
          res.status(200).json(data);
        })



    })

})



router.patch('/messages/:id', (req, res) => {
  console.log("EDIT", req.params.id);
  console.log("EDIT", req.body.userId);
  Message.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(val => {
    console.log(val);
  })
});

router.delete('/messages/:id', (req, res) => {
  console.log("req params", req.params);
  console.log("req params id", req.params.id);
  Message.destroy({
    where: {
      id: req.params.id
    }
  }).then(val => {
    console.log(val);
  })
});



router.post('/topics', (req, res) => {
  console.log('/topics posting!!! from backend')

  Topic.findAll().then((val) => {
    res.send(val)
  })

});


// router.post('/circles', (req, res) => {
//     var body = req.body
//     console.log('THIS IS BODY of circles!!', body);
//     // body = JSON.stringify(body)
//     // res.send(body);
//     let newCircle = {
//         name: body.body,
//         userId: body.userId,
//         totalMembers: 1
//     };


//     Circle.create(newCircle)
//     .then( (data) => {
//         // res.status(200).json(data);
//         return data;
//     }).then( (data) => {

//         console.log(data.dataValues, ' DATATATATATATATATAATATA');

//         User_Circles.create({
//         status: "member",
//         userId: body.userId,
//         circleId: data.dataValues.id
//         })
//         .then( (data) => {
//             res.status(200).json(data);
//         })



//     })

// })



router.post('/comment', (req, res) => {
  var body = req.body;
  console.log('this is req.body from comments!!!!', req.body);

  Comment.create({
    text: req.body.text,
    userId: req.body.userId,
    messageId: req.body.messageId
  }).then((data) => {
    console.log('data! from comment create', data.dataValues)
    res.status(200).json(data)
  })
})



router.get('/comments/:messageId', (req, res) => {
  var messageId = req.params.messageId;
  Comment.findAll({
      where: {
        messageId: messageId
      },
      include: [User]
    })
    .then(comments => {
      const resObj = comments.map(comment => {
        return Object.assign({}, {
          text: comment.dataValues.text,
          date: comment.dataValues.createdAt,
          userId: comment.dataValues.userId,
          messageId: comment.dataValues.messageId,
          id: comment.dataValues.id,
          username: comment.dataValues.user.username
        })
      })
      res.json(resObj);
    })
});

router.get('/topicOwner/:topicId', (req, res) => {
  var topicId = req.params.topicId;
  User_Topics.find({
    where: {
      status: "original poster",
      topicId: topicId
    }
  }).then( (data) => {
    var userId = data.dataValues.userId;
    console.log('THIS IS USER ID', userId)
    console.log('this is the person found!', data.dataValues)
    // res.json(data);
    return userId
  })
  .then( (userId) => {
      User.find({
        where: {
          id: userId
        }
      }).then( (dataum) => {
        res.send(dataum);
      })
  })
});



router.post('/poll', controller.poll.post)

router.get('/votes', controller.vote.get)
router.post('/votes', controller.vote.post)

router.get('/results', controller.result.get)
router.post('/results', controller.result.post)

router.post('/trustedcircle', controller.trustedcircle.post)

router.post('/signup', controller.signup.post);
router.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(400);
      return res.send('false');
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });

  })(req, res, next);

});



module.exports = router;

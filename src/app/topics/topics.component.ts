import { Component, OnInit } from '@angular/core';
import { TopicsService } from '../services/topics.service';
import { ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, JsonpModule } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { trigger, state, animate, style, transition, keyframes, group } from '@angular/core';




import { DavidDataService } from '../services/david-data.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
  animations: [
    trigger('list2', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        animate(1000, keyframes([
          style({
            transform: 'translateX(-100px)',
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'translateX(-50px)',
            opacity: 0.5,
            offset: 0.3
          }),
          style({
            transform: 'translateX(-20px)',
            opacity: 1,
            offset: 0.8
          }),
          style({
            transform: 'translateX(0px)',
            opacity: 1,
            offset: 1
          })
        ]))
      ]),
      transition('* => void', [
        group([
          animate(300, style({
            color: 'red'
          })),
          animate(800, style({
            transform: 'translateX(100px)',
            opacity: 0
          }))
        ])
      ])
    ]),
  ]
})
export class TopicsComponent implements OnInit {
  newTopic: any = {user: sessionStorage.getItem('username')};
  circle: string = sessionStorage.getItem('circle');
  topics: any = [];
  allCircles : any = [];
  userInfo: {};
  filteredItems: {};
  currentCircle: string; 
  usersOfCircle: any [];
  temp : any = {};

  usersNotOfCircle: any [];


  user_topic: any;

  topicId: any;
  // topics: any = [{user: 'Felipe', body: "Why don't we have president's day off?"}, {user: 'David', body: "Where is Glenn?"}, {user:'Richard',body: "Why does my room smell so bad?"}]
  // users: any = ['David', 'Richard', 'Gabe', 'Kan', 'Ricky']
  
  // clicked(topic, idx){
  //   sessionStorage.setItem('topicBody', topic.body)

  //   sessionStorage.setItem('topicUser', topic.user)
  //   // //console.log(this.daveData);
  //   //console.log(idx);
  //   this.DavidDataService.clickedTopic = topic;
  //   //console.log(this.DavidDataService.clickedTopic);
  //   localStorage.setItem('clickedTopic', topic)



  // }
  // createTopic(){
  //   if(this.topics.indexOf(this.newTopic) === -1){
  //     this.topics.push(this.newTopic)
  //   }
  //   this.newTopic = {user:sessionStorage.getItem('username'), body: null}
  // }

  constructor(private _TopicsService: TopicsService,
              private DavidDataService: DavidDataService,
              private route: ActivatedRoute,
              private http: Http
              ) { }

  ngOnInit() {
    // sessionStorage.removeItem('topic')
    this.setTopics()

    this.currentCircle = localStorage.getItem('currentCircle');
    this.filterItem('');
    
    this.getUsers();
    // this.davidGetUsers();
    // this.davidGetNotUsers();
  }



  setTopics() {
    this.DavidDataService.getAllCurrentUserData(localStorage.getItem('userID'))
            .subscribe( (data) => {
                        var theData = data


                        this.user_topic = data.users_topicsALL;


                        for (var circles of theData.circlesObj) {
                          if(circles.name === localStorage.getItem('currentCircle')) {
                            var idx = circles.id;
                            //console.log(idx);
                            this.DavidDataService.currentCircle = idx;
                          }
                        }

                        //console.log(theData.circles_topics);
                        //console.log(this.DavidDataService.currentCircle);
                        //console.log(idx);
                        for(var prop in theData.circles_topics) {
                          //console.log(prop)
                          if(prop == idx) {
                            var topics = theData.circles_topics[prop]
                            for(var topic of topics) {

                              this.topics.push([topic.body,topic.id]);
                              //console.log(this.topics);
                            }
                          }
                        }




                        // for (var topic of topics) {
                        //   this.topics.push(topic.body);
                        // }
          })
  }


  topicClicked(topicName, idx) {
    //console.log('THISSSS', this.user_topic)
    //console.log('this is the selected topic\'s id', idx);
    // var arr_user_topic = this.user_topic;
    // this.DavidDataService.getUser(idx) 
    // .subscribe( (data) => {
    //   //console.log(data, 'DATA!!!!')
    //   for(var user_topic of arr_user_topic) {
    //     if(user_topic.userId == data.id) {
    //       //console.log(data.username);
    //       sessionStorage.setItem('topicUser', data.username);
    //     }
    //   }






    // })
    //console.log('this is the id of the topic selected', idx)

    sessionStorage.setItem('topicSelectedIdx', idx);
    sessionStorage.setItem('topicBody', topicName)
    localStorage.setItem('topicBody', topicName)
  }



  // topicClicked(topicName) {
  //   //console.log('this is the topic!', topicName)
  //   //GET TOPICS_USERS
  //   this._TopicsService.getUsersTopics()
  //                     .subscribe( (data1) => {
  //                       //console.log("Where is this data man", data1)
  //                               //GET TOPICS
  //                               this._TopicsService.getTopics()
  //                               .subscribe( (data) => {
  //                                 //console.log("WHAT AM I???", data)
  //                                 data.forEach((val)=>{
  //                                   if(val.body === topicName){
  //                                   this.topicId = val.id; 
  //                                   //console.log(data1, 'data from the getUSERTOPICS');
  //                                   //console.log(this.topicId,'THIS IS TOPIC ID!');
                                    
  //                                       //GET USERS
  //                                       this._TopicsService.getUsers()
  //                                       .subscribe( (data3) => {
  //                                         //console.log("Where is this data man of GET USERS", data3)
  //                                         for(var prop1 of data1) {
  //                                           if(prop1.status === "original poster" && this.topicId === prop1.topicId) {
  //                                             for(var prop3 of data3) {
  //                                               //console.log('proP333333', prop3)
  //                                               if(prop3.id === prop1.userId) {
  //                                                 //console.log(prop3, prop1);
  //                                                 sessionStorage.setItem('topicOwner', prop3.username);
  //                                                 sessionStorage.setItem('topicUser', prop3.username);
                                                  
  //                                               }
  //                                             }
                                            

  //                                             //console.log( sessionStorage.getItem('topicOwner') );
  //                                           } 
  //                                         }



  //                                       })

  
  //                                   }
  //                                 }) 
  //                                 }
  //                               )//end getTopics function

  //                     })


  //   sessionStorage.setItem('topicBody', topicName)
  //   sessionStorage.setItem('topicUser', sessionStorage.getItem('topicOwner'));
  // }

  filterItem(value){
   if(value === '') {this.filteredItems = null;} //when nothing has typed
   else {
   this.filteredItems = Object.assign([], this.userInfo)
   this.filteredItems = Object.assign([], this.userInfo).filter(
      item => item.username.toLowerCase().indexOf(value.toLowerCase()) > -1
   )
   }
  }

  printuser(user) {
    //console.log(user)
    sessionStorage.setItem('suggestedUsername', user.username)
    sessionStorage.setItem('suggestedUserId', user.id)
  }

  getUsers() {
    this._TopicsService.getUsers()
                      .subscribe( (data) => {
                        //console.log("Where is this data man", data)
                        this.userInfo = data;
                        this.filterItem('');
                        //console.log('yo wtf', this.userInfo)
                        //console.log('goddamnit', this.filteredItems)
                      })
  }

  // davidGetUsers() {
  //   //console.log('davidGetUsers Lawnches')
  //   //console.log(typeof localStorage.getItem('currentCircleId'))
  //   this.DavidDataService.davidGetUsers(localStorage.getItem('currentCircleId'))
  //   .subscribe( (data) => {
  //     //console.log(data);
  //       // this.usersOfCircle = data;
  //     //console.log('lame');
  //   });
  // }

  // davidGetNotUsers() {
  //   this.DavidDataService.davidGetNotUsers(localStorage.getItem('currentCircleId'))
  //   .subscribe( (data) => {
  //     //console.log(data);
  //       // this.usersNotOfCircle = data;
  //     //console.log('lame');
  //   });
  // }

  // getTopics() {
  //   //console.log('inside getTopics function inside CirclesComponent')
  //   //find the current circles's Id by name
    

  //   this._TopicsService.getCircles()
  //                     .subscribe( (data) => {
  //                       //console.log("WHAT AM I???", data)
  //                       data.forEach((val)=>{
  //                         //console.log(val);
  //                         this.allCircles.push(val)
  //                       }) 
  //                       //console.log('list of allCircles', this.allCircles)
  //                       //console.log('this is the current Circle', sessionStorage.getItem('circle') );

  //                       for(var props in this.allCircles) {
  //                         for(var prop in this.allCircles[props]) {
  //                           if (this.allCircles[props][prop] === sessionStorage.getItem('circle')) {
  //                             var topicIdFound = this.allCircles[props]["id"];
  //                             //console.log('this is the id:', this.allCircles[props]["id"])
  //                           }
  //                         }
  //                       }

  //                               this._TopicsService.getTopics()
  //                               .subscribe( (data) => {
  //                                 //console.log("WHAT AM I???", data)
  //                                 data.forEach((val)=>{
  //                                   //console.log(val);
  //                                   if(val.circleId === topicIdFound) {
  //                                   this.topics.push(val.body)
  //                                   }
  //                                 }) 
  //                                 //console.log('list of topics', this.topics)
  //                                 }
  //                               )//end getTopics function



  //                       }
  //                     )//end getCircles

  //   //console.log('ALL CIRCLES', this.allCircles)


  // }//end getTopics  

  createTopic(name) {
    //console.log(name);
    let body = {
      body: name,
      circleId: localStorage.getItem('currentCircleId'),
      userId: localStorage.getItem('userID') || sessionStorage.getItem('userId')
    }
    //console.log(body);

    let headers = new Headers({'Content-Type': 'application/json'});
        this.newTopic.body = '';
        return this.http.post('http://52.34.112.223:3000/api/topics', body, {headers: headers})
        .map(res => res.json()).subscribe((data) => {
          this.topics.push([body.body, data.topicId]);
          //console.log(data)
        })



  }

  
    // addMessage(message: Message) {
    //     let body = JSON.stringify(message);
    //     let headers = new Headers({'Content-Type': 'application/json'});
    //     return this.http.post('/api/messages', body, {headers: headers})
    //         .map((response: Response) => {
    //             let result = response.json();
    //             //console.log('result', result);
    //             let message = new Message(result.body, 'Dummy', result.id, null);
    //             this.messages.push(message);
    //             return message;
    //         })
    //         .catch((error: Response) => Observable.throw(error.json() || 'Server error'));



    // }

}

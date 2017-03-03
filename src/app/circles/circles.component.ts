import { Component, OnInit, Input, Output,trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  group } from '@angular/core';
import { CirclesService } from '../services/circles.service';
import { Http, HttpModule, Response, Headers, JsonpModule } from "@angular/http";
import { Router } from '@angular/router';
import { DavidDataService } from '../services/david-data.service';

import { TopicsComponent } from '../topics/topics.component';

@Component({
  selector: 'app-circles',
  templateUrl: './circles.component.html',
  styleUrls: ['./circles.component.scss'],
  animations: [
      trigger('list1', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ])
    ]),
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
export class CirclesComponent implements OnInit {
    state = 'normal';
  wildState = 'normal';
  list = ['I hate puppies', 'I could kill my owner if I was larger', 'I can see dead people.... well mice'];

  public picture: "http://santetotal.com/wp-content/uploads/2014/05/default-user.png";
  username: string = localStorage.getItem('username');
  newCircle: string;
  circlesUser: any = [];
  finalComparedCircles: any = [];
  circles: any = [];
  public photo = localStorage.getItem('photo');
  loadTopic: any = false;
  loadCircle: any = false;
  

  //['Hack Reactor', 'Movies', 'Soccer'];

  constructor(private _CirclesService: CirclesService,
              private DavidDataService: DavidDataService,
              private http: Http,
              private router: Router
              ) { }

  ngOnInit() {
    sessionStorage.removeItem('circle')
    //console.log(localStorage.getItem('photo'));

    // this.getTopics();
    // this.getCircles();
    // this.getCurrentUserCircles();
    this.setCircles();
  }
  onAnimate() {
    this.state == 'normal' ? this.state = 'highlighted' : this.state = 'normal';
    this.wildState == 'normal' ? this.wildState = 'highlighted' : this.wildState = 'normal';
  }
    onAdd(item) {
    this.list.push(item);
  }

  onDelete(item) {
    this.list.splice(this.list.indexOf(item), 1);
  }

  animationStarted(event) {
    //console.log(event);
  }

  animationEnded(event) {
    //console.log(event);
  }

  clicked(circle){
    //console.log('circle clicked')
    sessionStorage.setItem('circle',circle)
  }


  setCircles() {
    this.DavidDataService.getAllCurrentUserData(sessionStorage.getItem('userId'))
            .subscribe( (data) => {
                        var theData = data
                        //console.log("HOW CAN I USE THIS", theData)

                        for (var circle of theData.circlesObj) {
                          this.finalComparedCircles.push([circle.name,circle.id]);
                          //console.log(this.finalComparedCircles)
                        }

                        this.loadCircle = true;
          })
  }

  getCircles () { 
    //console.log('users to circle', this.DavidDataService.allUserCircles);
    //console.log('current user logged in', localStorage.getItem('userID'));
    var currentUser = localStorage.getItem('userID');
    //console.log('just circles', this.DavidDataService.allCircles);
    var allUserCirclesArray =  this.DavidDataService.allUserCircles;
    var allCirclesArray = this.DavidDataService.allCircles;
    for(var UserCircleObj of allUserCirclesArray) {
      for(var circleObj of allCirclesArray) {
        if(UserCircleObj.circleId === circleObj.id) {
          //console.log(UserCircleObj["userId"] === currentUser);
          if(UserCircleObj["userId"].toString() === currentUser) {
          // //console.log('this user has access', UserCircleObj.userId)
            this.finalComparedCircles.push(circleObj.name);
            //console.log(this.DavidDataService.currentUsername, 'current username')

          }
        }
      }
    }
  }

  getCurrentUserCircles() {
    // //console.log('inside getTopics function inside CirclesComponent')
    this.DavidDataService.getCurrentUserCircles()
                      .subscribe( (data) => {
                        //console.log(this.DavidDataService.currentUserCirclesBelong);
                        //console.log(data, 'this is data and its subscribed');
                        }) 
            
  }//end getTopics

  getTopics() {
    // //console.log('inside getTopics function inside CirclesComponent')
    this._CirclesService.getTopics()
                      .subscribe( (data) => {
                        // //console.log("WHAT AM I???", data)
                        data.forEach((val)=>{
                          // //console.log(val);
                          this.circles.push(val.body)
                        }) 
                        // //console.log('list of rooms', this.circles)
                        }
                      )
  }//end getTopics

  circleClicked(circleName) {
    // //console.log('the circle clicked on is!', circleName);
    for(var circle of this.finalComparedCircles) {
      // //console.log('these are the circles!', circle);
      if(circleName === circle[0]) {
        localStorage.setItem('currentCircleId', circle[1]);
        // //console.log('this is the circles id', circle[1]);
      }
    }
    localStorage.setItem('currentCircle', circleName);
    this.loadTopic = true;
    
  }


  createCircle(name) {

    //console.log(name);
    let body = {
      body: name,
      userId: localStorage.getItem('userID') || sessionStorage.getItem('userId')
    }
    //console.log(body);

    let headers = new Headers({'Content-Type': 'application/json'});

    var nameCheck = name;

    if (name) {
              this.http.get('http://52.34.112.223:3000/api/circles/'+nameCheck).map(res => res.json()).subscribe((data) => {
              //console.log(data, 'this is the returned data from the nameCheckGet')

              if(data.length !== 0) {
                      return alert('That Circle Already Exists!');
              } else {
                this.newCircle = '';
                      return this.http.post('http://52.34.112.223:3000/api/circles', body, {headers: headers})
                      .map(res => res.json()).subscribe((data) => {
                        // this.finalComparedCircles.push([body.body, data.topicId]);
                        // this.finalComparedCircles.push()
                        this.finalComparedCircles.push([ name, data.circleId]);
                        //console.log(data, 'this is the returned data/1')
                      })

              }
            })   
    } else {
        return alert('Please Have a Valid Name for a Circle!')
    }

  }

  over () {
    //console.log('went over!!')
  }

}

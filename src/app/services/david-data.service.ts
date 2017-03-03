import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, JsonpModule, Response } from '@angular/http';

@Injectable()
export class DavidDataService {
  //example to store shit
  //private storeDummyData
private storeDummyData: any;
public allUsers: any;
public allTopics: any;
public allUserTopics: any;
public allUserCircles: any;
public allCircles: any;
public gotUser: any;

public currentCircle: any;
public currentUsername: any;
public currentUserId: any;
public currentTopic: any; 

public currentUserCirclesBelong: any;
public currentUserTopicBelong: any; 
public currentUserCircleToTopicBelong: any; 

public getAllCurrentUserDataStorage: any;

public clickedTopic: any;

  constructor(private http: Http) { }

    getAllCurrentUserData(id: string): Observable<any> {
      //console.log('GOT ALL THE DATA for', localStorage.getItem('userID'))

    var data = this.http.get('http://52.34.112.223:3000/api/userCircleTopic/'+id)
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))

    // //console.log(this.getAllCurrentUserDataStorage);
    // this.getAllCurrentUserDataStorage = data;
    return data;
  }
  
    davidGetUsers(circleId: string): Observable<any> {

    var data = this.http.get('http://52.34.112.223:3000/api/get_users_circles/'+circleId)
                    .map( ( res:Response ) => {
                      //console.log('getting in here!!')
                      //console.log(res.json());
                      return res.json()
                    })
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))

    // //console.log(this.getAllCurrentUserDataStorage);
    // this.getAllCurrentUserDataStorage = data;
    return data;
  }

    davidGetNotUsers(circleId: string): Observable<any> {

    var data = this.http.get('http://52.34.112.223:3000/api/get_users_non_circles/'+circleId)
                    .map( ( res:Response ) => {
                      //console.log('getting in here!!')
                      //console.log(res.json());
                      return res.json()
                    })
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))

    // //console.log(this.getAllCurrentUserDataStorage);
    // this.getAllCurrentUserDataStorage = data;
    return data;
    }


  getUser(id): Observable<any> {
    //console.log('INSIDE DAVID service for getUsers')

    var data = this.http.get('http://52.34.112.223:3000/api/user/'+id)
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))

    this.gotUser = data;
    return data;
  }

  getTopicOwner(id): Observable<any> {
    //console.log('INSIDE DAVID service for [getTopicOwner]')

    var data = this.http.get('http://52.34.112.223:3000/api/topics_to_user/'+id)
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))

    // this.gotUser = data;
    return data;
  }


  getUsers(): Observable<any> {
    //console.log('INSIDE DAVID service for getUsers')

    var data = this.http.get('http://52.34.112.223:3000/api/users')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))

    this.allUsers = data;
    return data;
  }

  getTopics(): Observable<any> {
    //console.log('INSIDE DAVID service for getTopics')
     var data = this.http.get('http://52.34.112.223:3000/api/topics')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    this.allTopics = data;
    return data;
  }

  getUsersTopics(): Observable<any> {
    //console.log('INSIDE getUSersTopics in service')
     var data = this.http.get('http://52.34.112.223:3000/api/users_topics')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    this.allUserTopics = data;
    return data;
  }

  getUsersCircles(): Observable<any> {
    //console.log('INSIDE get/users_circles in service')
     var data = this.http.get('http://52.34.112.223:3000/api/users_circles')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    this.allUserCircles = data;
    return data;
  }
  
  getCircles(): Observable<any> {
    //console.log('INSIDE getCircleId in service topics')
     var data = this.http.get('http://52.34.112.223:3000/api/circles')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    this.allCircles = data;
    return data;
  }

    getCurrentUserCircles(): Observable<any> {
    //console.log('INSIDE getCurrentUserCircles in service topics')
    var id = localStorage.getItem('userID').toString();
    //console.log(id);
    var url = 'http://52.34.112.223:3000/api/userCircleTopic/'+id.toString();
    //console.log(url);
     var data = this.http.get(url)
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    this.currentUserCirclesBelong = data;
    return data;
  }

}

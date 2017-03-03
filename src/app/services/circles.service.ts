import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http, JsonpModule, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

// import { Circle } from './Circle';

//Circle Model
// var Circle = sequelize.define('circles', {
//   name: Sequelize.STRING,
//   totalMembers: Sequelize.INTEGER
// });
//import { Hero } from './hero';
// export class Hero {
//   id: number;
//   name: string;
// }

@Injectable()
export class CirclesService {

  constructor (private http: Http) {}

  private url1 = "http://52.34.112.223:3000"; //our server
  private socket: any;
  private heroesUrl = 'api/heroes';  // URL to web api




  // postTopics(): Observable<any> {
  //   //console.log('INSIDE getTopics in service')
  //   return this.http.post(this.url1+'/api/topics')
  //                   .map( ( res:Response ) => res.json() )
  //                   .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
  // }

  getCircles(): Observable<any> {
    //console.log('INSIDE getTopics in service')
    return this.http.get(this.url1+'/api/circles')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
  }

  getUserCircles(): Observable<any> {
    //console.log('INSIDE getTopics in service')
    return this.http.get(this.url1+'/api/users_circles')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
  }

  getTopics(): Observable<any> {
    // //console.log('INSIDE getTopics in service')
    return this.http.get(this.url1+'/api/topics')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
  }

}

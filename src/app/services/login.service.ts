import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService implements OnInit {

  private flag = false;
  private dummyData: any;


  constructor(private _http: Http) { }

  ngOnInit () {
    
  }

  login(username, password) {
    return this._http.post('http://52.34.112.223:3000/api/login', {
      username: username,
      password: password
    });
  }

   getUserId () : Observable <any> {
    return this._http.get('http://52.34.112.223:3000/api/users')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
  }

  // storeDummyData () {
  //   //console.log(this.dummyData, 'before');
  //   this.dummyData = 123;
  //   //console.log(this.dummyData, 'after');
  // }
}

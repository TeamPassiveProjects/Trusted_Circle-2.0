import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthGuard } from '../services/auth-guard.service';

@Injectable()
export class SignupService {

  constructor(private _http: Http, private authGuard: AuthGuard) { }

  signUp(username, password, email, firstname, lastname) {
    //console.log('signup works', username)
    return this._http.post('http://52.34.112.223:3000/api/signup', {
      username: username,
      password: password,
      email: email,
      firstname: firstname,
      lastname: lastname
    });

  }
}
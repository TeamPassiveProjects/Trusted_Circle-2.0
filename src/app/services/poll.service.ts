import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, JsonpModule, Response, Headers } from '@angular/http';

@Injectable()
export class PollService {

  constructor (private _http: Http) {}

  private url = "http://52.34.112.223:3000";

  yes(suggestedUser, circle, suggestor): Observable<any> {
    //console.log('INSIDE postpoll in service')
    var data = this._http.post('http://52.34.112.223:3000/api/poll', {
      suggestedUser:suggestedUser,
      circle: circle,
      suggestor: suggestor
    })
      .map( ( res:Response ) => res.json() )
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    return data;
  }
}

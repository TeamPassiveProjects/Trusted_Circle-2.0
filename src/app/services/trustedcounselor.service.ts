import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, JsonpModule, Response, Headers } from '@angular/http';

@Injectable()
export class TrustedcounselorService {

  constructor (private _http: Http) {}

  private url = "http://52.34.112.223:3000";

  invite(circle): Observable<any> {
    var data = this._http.post('http://52.34.112.223:3000/api/trustedcounselor', {
      circle: circle
    })
      .map( ( res:Response ) => res.json() )
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    return data;
  }
}

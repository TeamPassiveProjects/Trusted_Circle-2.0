import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, JsonpModule, Response, Headers, URLSearchParams } from '@angular/http';

@Injectable()
export class ResultService {
  public resultData: any;

  constructor (private _http: Http) {}

  private url = "http://52.34.112.223:3000";

  getResult(): Observable<any> {
    var data = this._http.get('http://52.34.112.223:3000/api/results')
      .map( ( res:Response ) => res.json() )
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    this.resultData = data;
    return data
  }
  
  reject(circleId, userId): Observable<any>{
    return this._http.post('http://52.34.112.223:3000/api/results', {
      circleId: circleId,
      userId: userId,
      choice: 'reject'
    })
  }

  accept(circleId, userId): Observable<any>{
    return this._http.post('http://52.34.112.223:3000/api/results', {
      circleId: circleId,
      userId: userId,
      choice: 'accept'
    })
  }
}

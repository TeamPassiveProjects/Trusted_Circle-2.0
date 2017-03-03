import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, JsonpModule, Response, Headers, URLSearchParams } from '@angular/http';

@Injectable()
export class VoteService {
  public voteData: any;

  constructor (private _http: Http) {}

  private url = "http://52.34.112.223:3000";

  getVote(): Observable<any> {
    var data = this._http.get('http://52.34.112.223:3000/api/votes')
      .map( ( res:Response ) => res.json() )
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    this.voteData = data;
    return data
  }
  
  denyUser(voteId, pollId): Observable<any>{
    return this._http.post('http://52.34.112.223:3000/api/votes', {
      voteId: voteId,
      pollId: pollId,
      choice: 'deny',
      complete: true
    })
  }

  acceptUser(voteId, pollId): Observable<any>{
    return this._http.post('http://52.34.112.223:3000/api/votes', {
      voteId: voteId,
      pollId: pollId,
      choice: 'accept',
      complete: true
    })
  }
}

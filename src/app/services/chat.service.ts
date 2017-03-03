import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { Http, JsonpModule, Response } from '@angular/http';

@Injectable()
export class ChatService {

  constructor (private http: Http) {}

  private url = "http://52.34.112.223:3000"; //our server
  private url1 = "http://52.34.112.223:3000"; //our server
  private socket: any;

  getRoomlist(): Observable<any> {
    //console.log('INSIDE getRoomlist')
    return this.http.get(this.url1+'/api/roomlist')
                    .map( ( res:Response ) => res.json() )
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
  }

  
  joinRoom (roomName: string) {
    //console.log('room created with', roomName)
    sessionStorage.setItem('roomName', roomName);
    this.socket.emit('create', sessionStorage.getItem('username') , roomName);
  }


  sendMessage (message:any, username: string, roomName: string) {
    this.socket.emit('add-message', message, username, roomName);
  }

  getMessages() {
    let observable = new Observable( (observer: any) => {
      this.socket = io(this.url);
      this.socket.on('message', (data: any) => {
        //console.log(data,'from the chat service');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }

  getUsername () {
    return sessionStorage.getItem('username')
  }

  setUsername (username: string) {
    //console.log('username set: '+username);
    //console.log(sessionStorage, 'from the setUsername in chat.services.ts');
    sessionStorage.setItem('username', username);
  }

}

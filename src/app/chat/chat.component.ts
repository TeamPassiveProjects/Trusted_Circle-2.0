import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { HttpModule, JsonpModule } from '@angular/http';
// import { ChatImageComponent } from '../chat-image/chat-image.component'; possibly not needed

// import * as Message from '../../../models/messages.model';

@Component({
  // moduleId: module.id,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
   @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  username: any = localStorage.getItem('username');

  messages: any = [];
  message: any;
  rooms: any = [];
  roomName: string;
  connection: any;
  usernameStatus: any = false;
  roomnameStatus: any = false;
  roomSelected: any = false;

  listOfRooms: any = [];
  errorMessage: string;


  //username: string;
  alert: any = false;

  constructor(private _chatService: ChatService) {

   }

   ngOnInit() {
     //http://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
    this.scrollToBottom();

    this.connection = this._chatService.getMessages().subscribe(
      message => {
        //console.log('ROOM NAME', this.roomName);
        //console.log(message, 'this is from the chat component');
        //console.log(sessionStorage.getItem('roomName'))

        //console.log('####about to push####:', message )

        this.messages.push(message)
        
      }
    )

    //console.log('ngOnIT HAPPEN')
    this.getRoomlist()
    //console.log('AHHHHHH')

    //console.log(this.listOfRooms, 'After called in ngonit')

    if(this.username) {
      this.usernameStatus = true;
      //console.log(this.username, 'this.username', this.usernameStatus);
    }
   }

    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

   ngOnDestroy() {
      this.connection.unsubscribe();
   }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }


  //  clickedOnRoomName(value) {
  //    this.roomSelected = true;
  //    this.joinRoom (value);
  //    //console.log(value);
  //  }

  changeRoom() {
    this.roomSelected = false;
    this.messages = [];
  }

  getRoomlist() {
    //console.log('inside chat ChatComponent')
    this._chatService.getRoomlist()
                      .subscribe( (data) => {
                        if(data.length > 0) {
                        //console.log("WHAT AM I???", data)
                        data.forEach((val)=>{
                          this.listOfRooms.push(val)
                        }) 
                        //console.log('list of rooms', this.listOfRooms)

                      } else {

                          var sample = [
                            'Movies',
                            'TV Shows',
                            '	Music',
                            'Food',
                            'Politics',
                            '	Video Games',
                            'Religion',
                            '	Random',
                            'Today\'s News',
                            'Travel'
                          ]
                        sample.forEach((val)=>{
                          //console.log(val)
                          this.listOfRooms.push(val)
                        }) 

                      }


                        }
                      )
  }

  joinRoom (someValue) {
    //console.log('this is the join room function', someValue);
    //console.log('joined room function chat ChatComponent is:', someValue)
     this.roomName = someValue;
     this.roomSelected = true;
     this.roomnameStatus = true;
     this._chatService.joinRoom(someValue);
   }

   sendMessage () {
     //console.log('roomNAME IS!!!!', this.roomName);
     if(this.message) {
      //  //console.log(this.message)
     this._chatService.sendMessage(this.message, this.username, this.roomName);
     this.message = '';
     }
   }

   setUsername() {

    

     this._chatService.setUsername(this.username);
     //console.log('setUsername SET!!!')
     if(this.username) {
     this.usernameStatus = true;
     }
     this.alert = 'Username is set';
   }

   usernameClick(username, i) {
     //console.log('username is', username, 'this is their i value:', i);
   }



}

import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Message } from './message.model';
import { HttpModule, JsonpModule } from '@angular/http';

import { MessageService } from '../services/message.service'

@Component({
  selector: 'app-message-input',
  template:  `

      <push-notification #myNotification
        title="Trusted Circle message Posted"
        body="message Posted"
        icon="http://www.free-icons-download.net/images/red-circle-icon-69788.png"
        closeDelay="5000"
          (error)="handleError($event)">

        </push-notification>

  <h3>{{topicBody}} posted by 

  <span *ngIf="topicOwnerFound === true">{{topicUser}} </span>
  
  </h3>
  <div class="col-md-8 col-md-offset-2">
    <div *ngIf="flag">
    <form (ngSubmit)="onSubmit(f)" #f="ngForm">
        <div class="form-group">
           <span> <label for="content">Post As {{username}} or </label>
           <a (click)="anon()" >switch to Anonymous</a>
           </span>
            <input
                    type="text"
                    id="content"
                    class="form-control"
                    [ngModel]="message?.body"
                    name="content"
                    required>
        </div>
        <button type="button" class="btn btn-primary" (click)="onClear(f)">Clear</button>
        <button class="btn btn-default" type="submit" (click)="myNotification.show(f)">Post as {{username}}</button>

    </form>
    </div>
     <div *ngIf="!flag">
        <form #f="ngForm">
        <div class="form-group">
            <label for="content">Post As Anonymous</label>
            <input
                    type="text"
                    id="content"
                    class="form-control"
                    [ngModel]="message?.body"
                    name="content"
                    required>
        </div>
        <button type="button" class="btn btn-primary" (click)="onClear(f)">Clear</button>
        <button class="btn btn-danger" (click)='anonSubmit(f)'>Post as Anonymous</button> <a (click)="anon()" >Cancel</a>
        

    </form>
    </div>
</div>
  `
})

export class MessageInputComponent implements OnInit {
    message: Message;
    private flag = true;
    private flagf = true;
    private color = 'linear-gradient(red, darkred, red)';

    topicBody: string = sessionStorage.getItem('topicBody') || localStorage.getItem('topicBody')
    topicUser: string = '';
    constructor(private messageService: MessageService) {}
    userID: any = localStorage.getItem('userID');
    topicId: any = sessionStorage.getItem('topicSelectedIdx');
    username: string = localStorage.getItem('username');
    topicOwner: string;
    topicOwnerFound: any = false;

    anon() {
    
    if(this.flagf) {
        this.color='linear-gradient(lightgreen,green, lightgreen)';
    }
    else {
        this.color='linear-gradient(red, darkred, red)'
    }

    this.flagf = !this.flagf;
    this.flag = !this.flag;

    }


    onSubmit(form: NgForm) {
        var username: string = localStorage.getItem('username');
        if(this.message) {
            // Edit
            this.message.body = form.value.content;
            this.messageService.updateMessage(this.message)
            .subscribe(
                result => //console.log("here is the result", result)
            );
            this.message = null;
        } else {
            // Create
            //console.log( 'username' , username);
            const message = new Message(
                form.value.content, 
                username,
                0,
                this.userID,
                this.topicId
                );
            this.messageService.addMessage(message)
                .subscribe(
                    data => //console.log("succss here is the data ", data),
                    error => console.error("error here is the error ", error)
            );
        }
        form.resetForm();
    }
        anonSubmit(form: NgForm) {
                    var username: string = 'Anonymous';

        if(this.message) {
            // Edit
            this.message.body = form.value.content;
            this.messageService.updateMessage(this.message)
            .subscribe(
                result => //console.log("here is the result", result)
            );
            this.message = null;
        } else {
            // Create
            //console.log( "AM I IN HERE?");
            const message = new Message(
                form.value.content, 
                'Anonymous',
                0,
                54,
                this.topicId
                );
            this.messageService.addMessage(message)
                .subscribe(
                    data => //console.log("succss here is the data ", data),
                    error => console.error("error here is the error ", error)
            );
        }
        form.resetForm();
    }

    onClear(form: NgForm) {
        this.message = null;
        form.resetForm();
    }
    ngOnInit() {
        this.messageService.messageIsEdit.subscribe(
            (message: Message) => this.message = message
        );
        //get the topic owner here...
        this.messageService.getTopicowner( sessionStorage.getItem('topicSelectedIdx') ).subscribe(
            (data) => {
                //console.log('data from getTopicowner', data);
                this.topicUser = data.username;
                //console.log(this.topicOwner, 'Topic Owner!!!')
                this.topicOwnerFound = true;
            }
        )
        // this.topicOwner = sessionStorage
    }


}
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { Message } from './message.model';
import { Comment } from './comment.model';

import { Observable } from 'rxjs/Observable';
import { Http, JsonpModule, Response, Headers } from '@angular/http';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogRef } from 'angular2-modal';
import { MessageService } from '../services/message.service'

@Component({
    selector: 'app-message-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
    @Input() message: Message;
    @Input() comment: Comment;
    private userInfo = {
        username: '',
        disp: '',
        firstname: '',
        lastname: ''
    };

    constructor(private messageService: MessageService,
                private http: Http,
                public modal: Modal) {}
    ngOnInit() {}

    ttp(user) {

        if(this.userInfo.username === user) {
            return;
        }
        else {

        this.messageService.findUser(user)
        .subscribe( (data) => {
                        this.userInfo = data[0];
                        this.userInfo.disp = this.userInfo.lastname + ', ' + this.userInfo.firstname;
                        console.log(this.userInfo, 'this is data and its subscribed');
                        }) 
        }
    }
}

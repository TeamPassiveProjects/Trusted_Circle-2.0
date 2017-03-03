import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, style, transition, keyframes, group } from '@angular/core';

import { Message } from './message.model';
import { MessageService } from '../services/message.service'

@Component({
    selector: 'app-message-list',
    template: `
        <div class="col-md-8 col-md-offset-2">
            <app-message
                   [message]="message"
                   [@list1] *ngFor="let message of messages"></app-message>
        </div>
    `,
     animations: [
      trigger('list1', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ])
    ]),
    trigger('list2', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        animate(1000, keyframes([
          style({
            transform: 'translateX(-100px)',
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'translateX(-50px)',
            opacity: 0.5,
            offset: 0.3
          }),
          style({
            transform: 'translateX(-20px)',
            opacity: 1,
            offset: 0.8
          }),
          style({
            transform: 'translateX(0px)',
            opacity: 1,
            offset: 1
          })
        ]))
      ]),
      transition('* => void', [
        group([
          animate(300, style({
            color: 'red'
          })),
          animate(800, style({
            transform: 'translateX(100px)',
            opacity: 0
          }))
        ])
      ])
    ]),
  ]
})
export class MessageListComponent implements OnInit {
    messages: Message[];
     state = 'normal';
  wildState = 'normal';
    // username: string = localStorage.getItem('username');
    constructor(private messageService: MessageService) {
    // setTimeout(() => {
    //     this.messageService.getMessages();
    //     }, 2000);
        }


    ngOnInit() {
       this.messageService.getMessages()
       .subscribe( (data) => {
           //console.log('this is messages data inside list', data) 
           this.messages = data;
           });
           
    }
    
}

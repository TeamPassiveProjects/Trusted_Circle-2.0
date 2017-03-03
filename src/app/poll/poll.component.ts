import { Component, OnInit } from '@angular/core';
import { PollService } from '../services/poll.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
  suggestedMember: string = sessionStorage.getItem('suggestedUsername')
  circle: string = localStorage.getItem('currentCircle')
  suggestor: string = localStorage.getItem('username')
  showThis: boolean = true
  pollCreated: boolean = false
  pollInProgress: boolean = false
  blacklist: boolean = false
  alreadyMember: boolean = false

  constructor(private _PollService: PollService) { }


  yes(){
    //console.log(this.suggestedMember, this.circle, this.suggestor)
    this._PollService.yes(this.suggestedMember, this.circle, this.suggestor)
    .subscribe(data => {
      //console.log('what is the data over here eh?', data)
      this.showThis = false
      if(data.pollCreated === true){
        //console.log('poll created')
        this.pollCreated = true
      } else if(data.pollInProgress === true){
        //console.log('poll in progress')
        this.pollInProgress = true;
      } else if(data.blacklist === true){
        //console.log('member blacklisted')
        this.blacklist = true
      } else if(data.member === true){
        //console.log('already member')
        this.alreadyMember = true
      }
    })
  }

  ngOnInit() {
  }

}

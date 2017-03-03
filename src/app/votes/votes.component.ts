import { Component, OnInit } from '@angular/core';
import { VoteService } from '../services/vote.service';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

  suggestor: string;
  suggestedMember: string;
  circle: string;
  pollId: number;
  voteId: number;
  isDataAvailable: boolean = false;
  voteComplete: boolean = false;
  noVotes: boolean = false;
  
  constructor(private _VoteService: VoteService) { }

  accept(){
    //console.log('accepted')
    this._VoteService.acceptUser(this.voteId, this.pollId)
    .subscribe(data => {
      //console.log(data, 'vote was accepted')
    })
    this.voteComplete = true
    this.isDataAvailable = false
  }

  deny(){
    //console.log('denied')
    this._VoteService.denyUser(this.voteId, this.pollId)
    .subscribe(data => {
      //console.log(data, 'vote was accepted')
    })
    this.voteComplete = true
    this.isDataAvailable = false
  }

  ngOnInit() {
    this._VoteService.getVote()
    .subscribe(data => {
      if(data.noVotes === true){
        this.noVotes = true;
      } else {
        this.suggestor = data.suggestor
        this.suggestedMember = data.suggestedMember
        this.circle = data.circle
        this.pollId = data.pollId
        this.voteId = data.voteId
        this.isDataAvailable = true
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { ResultService } from '../services/result.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  suggestedMember: string = localStorage.getItem('username')
  circle: string;
  circleId: number;
  userId: number;
  isDataAvailable: boolean = false;
  joinCircle: boolean = false;
  rejectCircle: boolean = false;
  noInvites: boolean = false;

  constructor(private _ResultService: ResultService) { }

  reject(){
    this._ResultService.reject(this.circleId, this.userId)
    .subscribe((data) =>{
      //console.log('rejected to join', data)
    })
    this.rejectCircle = true;
    this.isDataAvailable = false;
  }

  accept(){
    this._ResultService.accept(this.circleId, this.userId)
    .subscribe((data) =>{
      //console.log('accepted to join', data)
    })
    this.joinCircle = true;
    this.isDataAvailable = false;
  }

  ngOnInit() {
    this._ResultService.getResult()
    .subscribe(data => {
      if(data.noInvites === true){
        this.noInvites = true;
      }
      //console.log('inside results get data', data)
      this.circle = data.circleName;
      this.userId = data.userId;
      this.circleId = data.circleId;
      this.isDataAvailable = true;
    })
  }

}

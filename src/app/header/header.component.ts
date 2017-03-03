import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { MdDialog } from '@angular/material';
import { DataService } from '../services/data.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { Http, Response, Headers, JsonpModule } from "@angular/http";

import { DavidDataService } from '../services/david-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private status = localStorage.getItem('username') || false;
  private n = 1;
  private userInfo = {
    photo: ''
  }

  constructor(overlay: Overlay, 
  vcRef: ViewContainerRef, 
  public modal: Modal,
  private sanitizer: DomSanitizer,
  public dialog: MdDialog,
  private DavidDataService: DavidDataService) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.sanitizer.bypassSecurityTrustHtml;
    // console.log(localStorage.getItem('username')) {
    //   this.status=true;
    // }
    this.userInfo.photo = localStorage.getItem('photo');
    this.getAllUsers();
    this.getAllTopics();
    this.getAllUsersTopics();
    this.getAllCircles();
    this.getAllUsersCircles();
    // this.getAllCurrentUserData();
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.status = null;
  }

  flag() {
    this.status = 'true';
  }

  openModal() {
    this.dialog.open(DialogOverviewExampleDialog);

    // this.modal.alert()
    //     .size('lg')
    //     .showClose(true)
    //     .title('Welcome, ' + localStorage.getItem('username'))
    //     .body(`
    //         <img src="http://santetotal.com/wp-content/uploads/2014/05/default-user.png" height="256px" width="256px">
    //         <h4>Alert is a classic (title/body/footer) 1 button modal window that 
    //         does not block.</h4>
    //         <b>Configuration:</b>
    //         <ul>
    //             <li>Non blocking (click anywhere outside to dismiss)</li>
    //             <li>Size large</li>
    //             <li>Dismissed with default keyboard key (ESC)</li>
    //             <li>Close wth button click</li>
    //             <li>HTML content</li>
    //         </ul>`)
    //     .open();
  }



  getAllUsers() {
    this.DavidDataService.getUsers()
                      .subscribe( (data) => {
                        //console.log("Where is this data man", data)
                        this.DavidDataService.allUsers = data;
                        console.log(this.DavidDataService.allUsers, 'who are the users?');
                      })
  }

  getAllTopics() {
    this.DavidDataService.getTopics()
                      .subscribe( (data) => {
                        //console.log("Where is this data man", data)
                        this.DavidDataService.allTopics = data;
                        console.log(this.DavidDataService.allTopics, 'what are the topics');
                      })
  }

  getAllUsersTopics() {
    this.DavidDataService.getUsersTopics()
                      .subscribe( (data) => {
                        //console.log("Where is this data man", data)
                        this.DavidDataService.allUserTopics = data;
                        console.log(this.DavidDataService.allUserTopics, 'what are the User-Topics');
                      })
  }
  
  getAllUsersCircles() {
    this.DavidDataService.getUsersCircles()
                      .subscribe( (data) => {
                        //console.log("Where is this data man", data)
                        this.DavidDataService.allUserCircles = data;
                        console.log(this.DavidDataService.allUserCircles, 'what are the User-Topics');
                      })
  }

  getAllCircles() {
    this.DavidDataService.getCircles()
                      .subscribe( (data) => {
                        //console.log("Where is this data man", data)
                        this.DavidDataService.allCircles = data;
                        console.log(this.DavidDataService.allCircles, 'what are the circles?');
                      })
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls: ['./header.component.css']
})
export class DialogOverviewExampleDialog {
  private model = {
    email: '',
    desc: '',
    image: ''
  };
  private flag = false;
  private loading = false;
  private wew = localStorage.getItem('photo');
  private udesc = localStorage.getItem('desc');

  constructor(private http: Http) { }

  toggle() {
    this.flag = !this.flag;
  }

  save() {
    console.log('started')
    let body = {
      id: localStorage.getItem('userID'),
      photo: '',
      email: '',
      desc: ''
    }

    if(this.model.image) {
      body.photo = this.model.image;
      this.wew = this.model.image;
      localStorage.setItem('photo', body.photo)
    }
    if(this.model.email) {
      body.email = this.model.email;
      localStorage.setItem('email', body.email)
    }
    if(this.model.desc) {
      body.desc = this.model.desc;
      this.udesc = this.model.desc;
      localStorage.setItem('desc', body.desc)
    }

    let headers = new Headers({'Content-Type': 'application/json'});
         this.http.patch('/api/edit', body, {headers: headers})
        .map(res => res.json()).subscribe((data) => {
          console.log(data)
        })

    this.flag = !this.flag;

  }
}
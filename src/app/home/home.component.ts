import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Directive, Renderer } from '@angular/core';
import { trigger, state, animate, style, transition } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AuthService} from '../services/auth.service';
import { DataService } from '../services/data.service';
import { SignupService } from '../services/signup.service';

import { DavidDataService } from '../services/david-data.service';
import { Parallax, ParallaxConfig  } from '../parallax.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  private flag = true;
  user: any = {};
  registerClicked: any = false;

  constructor(private loginService: LoginService, 
              private router: Router, 
              private authService: AuthService,
              private DavidDataService: DavidDataService,
              private signUpService: SignupService,
              private renderer: Renderer
              ) {this.renderer.listenGlobal('window', 'scroll', (event) => { //console.log('scroll'); });
}

  ngOnInit() {
    
  }

  submitSignup = () => {
    this.signUpService.signUp(this.user.username, this.user.password, this.user.email, this.user.firstname, this.user.lastname)
    // this.loginService.login(this.user.username, this.user.password)
    .subscribe(res => {
      this.user.firstname = '';
      this.user.lastname = '';
      this.user.email = '';
      this.user.username = '';
      this.user.password = '';

    this.flag = !this.flag;
    }
    , err => {
      //console.log('err', err);
    });
  }

  submitLogin = (value) => {
    //console.log(value);
    
    this.loginService.login(this.user.username, this.user.password)
      .subscribe(res => {
        localStorage.setItem('username', this.user.username);

        

        this.loginService.getUserId()
                                .subscribe( (data) => {
                                  // //console.log("WHAT AM I???", data)
                                  data.forEach((val)=>{
                                    //console.log('this is val:', val)
                                    if(val["username"] === localStorage.getItem('username') ) {
                                      localStorage.setItem('userID', val.id)
                                      localStorage.setItem('photo', val.photo)
                                      localStorage.setItem('desc', val.desc)
                                      localStorage.setItem('email', val.email)
                                      this.DavidDataService.getAllCurrentUserData( localStorage.getItem('userID') );

                                      sessionStorage.setItem('userId', res.json().id)
        // //console.log('user id ', sessionStorage.getItem('userId'))
        this.authService.isLoggedIn = true;
        this.router.navigate(['/circles']);

                                    }

                                  }) 
                                  // //console.log('list of topics', this.topics)
                                  }
                                )//end getTopics function




        this.user.username = '';
        this.user.password = '';

        // //console.log('res from login is: ', res);
        // //console.log('session username is:', localStorage.getItem('username'))
        // //console.log('res.status from login is: ', res.status);
      }, err => {
        // //console.log('err', err)
        err = 'Bad Login'
      });
  }

  register() {


    //console.log('fuk')
    this.flag = !this.flag;
  }

}

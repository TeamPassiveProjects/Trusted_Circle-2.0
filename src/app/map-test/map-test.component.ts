import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-test',
  templateUrl: './map-test.component.html',
  styleUrls: ['./map-test.component.scss']
})
export class MapTestComponent implements OnInit {

    title: string = 'My first angular2-google-maps project';
    lat: number = 51.678418;
    lng: number = 7.809007;

    location = {};
    setPosition(position){
      this.location = position.coords;
      console.log(position.coords);
    }


  constructor() { }

  ngOnInit() {
     if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
      };
   }
  


}
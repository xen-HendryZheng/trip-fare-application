import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'peakflo';

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.getHealthcheck();

  }

  getHealthcheck(){
    this.httpService.getRequest('/healthcheck/liveness',[]).subscribe((res: any) => {
      console.log(res);
    }, (err: any) => { console.log(err) });
  }
  
}

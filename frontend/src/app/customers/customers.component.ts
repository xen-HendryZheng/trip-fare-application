import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http-service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor(private httpService: HttpService) { }

  sorter: any = {
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
    "sunday": 7
  };
  fares: any = [];
  fareCap: any = [];
  ruleConfig: any = [];
  totalFare: number = 0;
  showResult: boolean = false;
  tripInputStr: any = 'green,green,2024-01-31T07:58:30Z\ngreen,red,2024-01-31T09:58:30Z\ngreen,green,2024-01-31T11:58:30Z';

  ngOnInit(): void {
    this.getFares();
    this.getRuleConfig();
    this.getFareCap();
  }

  async getFares() {
    this.httpService.getRequest('/fare-rule/list', {}).subscribe((res: any) => {
      this.fares = res;
    });
  }

  async calculateTotalFare() {
    if (this.tripInputStr == '') {
      alert('Please input trip');
      return;
    }
    // split tripInputStr by new line
    let trips = this.tripInputStr.split('\n');
    // loop through trips and split by comma
    let tripArr: any = [];
    trips.forEach((element: any) => {
      let trip = element.trim().split(',');
      tripArr.push({
        from: trip[0],
        to: trip[1],
        datetime: trip[2]
      });
    });
    // send request to backend
    this.httpService.postRequest('/fare/calculate-multiple', tripArr).subscribe((res: any) => {
      this.totalFare = res.total_fare;
      this.showResult = true;
    });

  }

  async getFareCap() {
    this.httpService.getRequest('/fare-rule/cap', {}).subscribe((res: any) => {
      this.fareCap = res;
      // Sort fareCap by item.cap_fare from lowest to highest
      this.fareCap.sort((a: any, b: any) => a.cap_fare - b.cap_fare);
    });
  }

  async getRuleConfig() {
    this.httpService.getRequest('/fare-rule/config', {}).subscribe((res: any) => {

      this.ruleConfig = res;
      // group rule config by day
      const ordered = this.ruleConfig.reduce((r: any, a: any) => {
        r[a.day] = [...r[a.day] || [], a];
        return r;
      }, {});
      this.ruleConfig = ordered;

    });
  }

  formatArray(arr: any) {
    let str = "";
    arr.forEach((element: any) => {
      str += this.formatTime(element.time_from) + " - " + this.formatTime(element.time_to) + "<br/>";
    });
    return str;
  }

  formatTime(time: number) {
    //time format would be 800 => 08:00
    let timeStr = time.toString();
    let sliced = timeStr.slice(0, -2);
    let minutes = timeStr.substring(2, 4);
    let hours = sliced.length == 1 ? "0" + sliced : sliced;
    minutes = minutes.length == 1 ? "0" + minutes : minutes;


    return hours + ":" + minutes;
  }

}

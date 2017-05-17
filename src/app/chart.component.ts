/**
 * Created by Michael on 5/16/2017.
 */
import {Component, OnInit} from '@angular/core';

import { DataRealtime } from './DataRealtime';
import { DataHistorical } from './DataHistorical';
import { RequestHistorical } from './RequestHistorical';
import { DataService } from './data.service';

@Component ({
  selector: 'mcbstm32-chart',
  template: `
    <div *ngIf="realtimeData">
      Temperature: {{realtimeData.temperature}} degC
      Humidity: {{realtimeData.humidity}}%
      Core Temperature: {{realtimeData.core_temperature}} degC
      Device Time: {{realtimeData.device_time}}
    </div>
  `,
  providers: [ DataService ]
})
export class ChartComponent implements OnInit {
  errorMessage: string;
  realtimeData: DataRealtime;
  historicalData: DataHistorical[];

  constructor (private dataService: DataService) {}

  ngOnInit() {
    this.getRealtimeData();
    this.getHistoricalData(this.getHistoricalDataRequest());
  }

  getRealtimeData() {
    this.dataService.getRealtimeData()
      .subscribe(
        realtimeData => this.realtimeData = realtimeData,
        error =>  this.errorMessage = <any>error);
  }

  getHistoricalData(request: RequestHistorical) {
    this.dataService.postHistoricalData(request)
      .subscribe(
        historicalData  => this.historicalData = historicalData,
        error =>  this.errorMessage = <any>error);
  }

  private getHistoricalDataRequest(): RequestHistorical {
    let nowInMsSince1970 = (new Date()).valueOf(); // now
    let startInMsSince1970 = nowInMsSince1970 - 3600000; // an hour ago

    let start = new Date(startInMsSince1970);
    let end = new Date();

    // convert to local time
    let offset = new Date().getTimezoneOffset();
    start.setMinutes(start.getMinutes() - offset);
    end.setMinutes(start.getMinutes() - offset);

    return { Start: start, End: end, IntervalMinutes: 1 };
  }
}

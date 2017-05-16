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
      Temperature: {{realtimeData.temperature}}
      Humidity: {{realtimeData.humidity}}
      Core Temperature: {{realtimeData.core_temperature}}
      Device Time: {{realtimeData.device_time}}
    </div>
  `,
  providers: [ DataService ]
})
export class ChartComponent implements OnInit {
  errorMessage: string;
  realtimeData: DataRealtime;
  historicalData: DataHistorical[];
  historicalDataRequest = { Start: new Date(), End: new Date(), IntervalMinutes: 1 };

  constructor (private dataService: DataService) {}

  ngOnInit() {
    this.getRealtimeData();
    // this.getHistoricalData(this.historicalDataRequest);
  }

  getRealtimeData() {
    this.dataService.getRealtimeData()
      .subscribe(
        realtimeData => this.realtimeData = realtimeData,
        error =>  this.errorMessage = <any>error);
  }

  getHistoricalData(request: RequestHistorical) {
    this.dataService.postHistoricalData(this.historicalDataRequest)
      .subscribe(
        historicalData  => this.historicalData = historicalData,
        error =>  this.errorMessage = <any>error);
  }
}

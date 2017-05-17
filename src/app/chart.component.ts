/**
 * Created by Michael on 5/16/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';

import { DataRealtime } from './DataRealtime';
import { DataHistorical } from './DataHistorical';
import { RequestHistorical } from './RequestHistorical';
import { DataService } from './data.service';

import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component ({
  selector: 'mcbstm32-chart',
  template: require('./chart.component.html'),
  providers: [ DataService ]
})
export class ChartComponent implements OnInit {
  errorMessage: string;
  realtimeData: DataRealtime;

  historicalTemp: number[] = [];
  historicalHum: number[] = [];
  historicalCoreTemp: number[] = [];
  historicalDevTime: string[] = [];

  // lineChart
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  public lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    //maintainAspectRatio: false,
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

  public HandleClick(): void {
    console.log('Clicked');
  }
  // end lineChart

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
        historicalData => this.extractChartData(historicalData),
        error =>  this.errorMessage = <any>error);
  }

  private getHistoricalDataRequest(): RequestHistorical {
    let nowInMsSince1970 = (new Date()).valueOf(); // now
    let startInMsSince1970 = nowInMsSince1970 - 24 * 3600000; // 24 hours ago

    let start = new Date(startInMsSince1970);
    let end = new Date();

    // convert to local time
    let offset = new Date().getTimezoneOffset();
    start.setMinutes(start.getMinutes() - offset);
    end.setMinutes(start.getMinutes() - offset);

    return { Start: start, End: end, IntervalMinutes: 60 };
  }

  private extractChartData(historicalData: DataHistorical[]) {
    for (let d of historicalData) {
      this.historicalTemp.push(d.temperature);
      this.historicalHum.push(d.humidity);
      this.historicalCoreTemp.push(d.core_temperature);
      this.historicalDevTime.push(d.device_time.toString().split('T')[1]);
    }

    console.log(this.historicalTemp);
    console.log(this.historicalHum);
    console.log(this.historicalCoreTemp);
    console.log(this.historicalDevTime);

    this.lineChartData = [
      {data: this.historicalTemp, label: 'Temperature'},
      {data: this.historicalHum, label: 'Humidity'},
      {data: this.historicalCoreTemp, label: 'Core Temperature'}
    ];

    setTimeout(() => {
      if (this.chart && this.chart.chart && this.chart.chart.config) {
        this.chart.chart.config.data.labels = this.historicalDevTime;
        this.chart.chart.update();
      }
    });
  }
}

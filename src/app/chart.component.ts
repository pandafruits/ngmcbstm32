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
  chartPeriods = 'Hour Day Week'.split(' ');
  selectedPeriod = 'Day';

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
  // end lineChart

  constructor (private dataService: DataService) {}

  onSelectedPeriodChange(newValue: string) {
    console.log(newValue);
    this.selectedPeriod = newValue;
    this.getHistoricalData(this.constructHistoricalDataRequest());
  }

  ngOnInit() {
    this.getRealtimeData();
    this.getHistoricalData(this.constructHistoricalDataRequest());
  }

  getRealtimeData() {
    // request a single real-time data first ...
    this.dataService.getRealtimeData()
      .subscribe(
        realtimeData => { console.log(realtimeData); this.realtimeData = realtimeData; },
        error => this.errorMessage = <any>error);

    // ... then request at fixed interval
    this.dataService.getRealtimeData(60000)
      .subscribe(
        realtimeData => { console.log(realtimeData); this.realtimeData = realtimeData; },
        error => this.errorMessage = <any>error);
  }

  getHistoricalData(request: RequestHistorical) {
    this.dataService.postHistoricalData(request)
      .subscribe(
        historicalData => { console.log(historicalData); this.updateChart(historicalData); },
        error =>  this.errorMessage = <any>error);
  }

  private constructHistoricalDataRequest(): RequestHistorical {
    let nowInMsSince1970 = (new Date()).valueOf();
    let startInMsSince1970, intervalMinutes;

    switch (this.selectedPeriod) {
      case 'Hour':
        startInMsSince1970 = nowInMsSince1970 - 3600000;
        intervalMinutes = 3;
        break;
      case 'Day':
        startInMsSince1970 = nowInMsSince1970 - 3600000 * 24;
        intervalMinutes = 60;
        break;
      case 'Week':
        startInMsSince1970 = nowInMsSince1970 - 3600000 * 24 * 5;
        intervalMinutes = 360;
        break;
    }

    let start = new Date(startInMsSince1970);
    let end = new Date();

    // convert to local time
    let offset = new Date().getTimezoneOffset();
    start.setMinutes(start.getMinutes() - offset);
    end.setMinutes(start.getMinutes() - offset);

    return { Start: start, End: end, IntervalMinutes: intervalMinutes };
  }

  private updateChart(historicalData: DataHistorical[]) {
    let historicalTemp: number[] = [];
    let historicalHum: number[] = [];
    let historicalCoreTemp: number[] = [];
    let historicalDevTime: string[] = [];

    for (let d of historicalData) {
      historicalTemp.push(d.temperature);
      historicalHum.push(d.humidity);
      historicalCoreTemp.push(d.core_temperature);
      historicalDevTime.push(d.device_time.toString().slice(5, 16));
    }

    this.lineChartData = [
      {data: historicalTemp, label: 'Temperature'},
      {data: historicalHum, label: 'Humidity'},
      {data: historicalCoreTemp, label: 'Core Temperature'}
    ];

    setTimeout(() => {
      if (this.chart && this.chart.chart && this.chart.chart.config) {
        this.chart.chart.config.data.labels = historicalDevTime;
        this.chart.chart.update();
      }
    });
  }
}

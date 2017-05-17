import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartComponent } from './chart.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    ChartsModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ChartComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

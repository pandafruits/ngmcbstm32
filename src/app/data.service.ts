/**
 * Created by Michael on 5/16/2017.
 */
import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { DataRealtime } from './DataRealtime';
import { DataHistorical } from './DataHistorical';
import { RequestHistorical } from './RequestHistorical';

@Injectable()
export class DataService {
  private getRealtimeDataUrl = 'http://e6410:50808/api/environmental/realtime';
  private postHistoricalDataUrl = 'http://e6410:50808/api/environmental/history';

  private static HandleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  constructor (private http: Http) {}

  getRealtimeData(): Observable<DataRealtime> {
    return this.http.get(this.getRealtimeDataUrl)
      .map(res => res.json() as DataRealtime)
      .catch(DataService.HandleError);
  }

  postHistoricalData(request: RequestHistorical): Observable<DataHistorical[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.postHistoricalDataUrl, request, options)
      .map(res => res.json() as DataHistorical[])
      .catch(DataService.HandleError);
  }
}

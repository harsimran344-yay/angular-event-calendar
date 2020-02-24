import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalendarAppService {

  constructor(private httpClient : HttpClient) {
  }

  initializeCalendarInfo(){
    return this.httpClient.post('https://timelyapp.time.ly/api/calendars/info', {url: 'https://calendar.time.ly/ficceyp4'}, {});
  }

  public getEventCalendar(calendarId): Observable<any> {
    const url = `https://timelyapp.time.ly/api/calendars/${calendarId}/events`;
    return this.httpClient.get(url, {});
  }
}

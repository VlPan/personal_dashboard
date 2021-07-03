import { DateHelper } from './../helpers/dateHelper';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateControlService {
  today: Date = new Date();

  isNextDay$: Subject<Date> = new Subject();

  constructor() {
    setInterval(() => {
      const currentDay = new Date();
      const isNewDay: boolean = DateHelper.isDatesEqual(currentDay, this.today);
      if(isNewDay) {
        this.today = currentDay;
        this.isNextDay$.next(this.today);
      }
    }, 60000);
  }


}
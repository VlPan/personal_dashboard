import { FocusEntry } from './../models';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorage } from './local-storage.service';
import { DateHelper, Range } from '../helpers/dateHelper';

@Injectable({
  providedIn: 'root',
})
export class PointsService {

  // todayChanged$: Subject<Date> = new Subject();
  pointsChanged$: Subject<Date> = new Subject();

  todayPoints: number = 0;
  daysHistory: HistoryEntries;
  focusHistory: FocusEntries;

  constructor(public ls: LocalStorage) {
    this.daysHistory = this.getAllHistory();
    this.focusHistory = this.getAllFocusEntries();
  }

  getAllHistory() {
    return this.ls.get(LocalStorage.HISTORY_ENTRIES_KEY) || {};
  }

  getHistoryAtDate(searchDate: string) {
    return this.getAllHistory()[searchDate] || {};
  }

  addPointsToDate(date: Date, points: number, type: PointsType) {
    const searchDate = this.getSearchString(date);

    const pointsHistory = this.getHistoryAtDate(searchDate);
    if(!pointsHistory[type]) {
      pointsHistory[type] = 0;
    }
    pointsHistory[type] += points;

    this.daysHistory[searchDate] = pointsHistory;
    this.ls.set(LocalStorage.HISTORY_ENTRIES_KEY, this.daysHistory);

    this.pointsChanged$.next(date);
 
  }

  getSearchString(d: Date) {
    return DateHelper.generateDateString(d);
  }

  getSelectedDayPoints(date: Date): number {
    const searchString = this.getSearchString(date);
    const todayHistory = this.getHistoryAtDate(searchString);

    return ( todayHistory.focus  || 0  ) + ( todayHistory.habits  || 0  ) + ( todayHistory.additional  || 0  );
  }

  getSelectedDayHistory(date: Date): PointsEntry {
    const searchString = this.getSearchString(date);
    const todayHistory = this.getHistoryAtDate(searchString);

    return todayHistory;
  }

  getAllFocusEntries() {
    return this.ls.get(LocalStorage.FOCUS_ENTRIES_KEY) || {};
  }

  getAllFocusEntriesAtDate(searchDate: string) {
    return this.getAllFocusEntries()[searchDate] || [];
  }

  saveFocusEntities(entities: FocusEntry[], date: Date): void {
    const searchDate = this.getSearchString(date);
    const todayFocus = this.getAllFocusEntriesAtDate(searchDate);

    entities.forEach(e => {
      todayFocus.push(e);
    })

    this.focusHistory[searchDate] = todayFocus;
    this.ls.set(LocalStorage.FOCUS_ENTRIES_KEY, this.focusHistory);
  }

  getHistoryFromRange({start, end}: Range): HistoryRange {
    const focus = [];
    const habits = [];
    const additional = [];

    const startIndex = start.getDay();
    const endIndex = end.getDay();


    let iteratedDate = new Date(start);
    

    for(let i = 0; i <= endIndex - startIndex; i++) {
     
      const currentStats: PointsEntry = this.getSelectedDayHistory(iteratedDate)
      console.log('-----> iteratedDate', iteratedDate);

      focus.push(currentStats.focus);
      habits.push(currentStats.habits);
      additional.push(currentStats.additional);

      iteratedDate.setDate(iteratedDate.getDate() + 1);
    }



    return {
      focus: focus,
      habits: habits,
      additional: additional,
    }
  }

}


export interface HistoryEntries {
  [date: string]: PointsEntry;
}

export interface FocusEntries {
  [date: string]: FocusEntry[];
}

export interface PointsEntry {focus: number, habits: number, additional: number};

export type PointsType = keyof PointsEntry;

export interface HistoryRange {
  [key: string]: number[]
}
import { BalanceService } from './balance.service';
import { FocusEntry } from './../models';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorage } from './local-storage.service';
import { DateHelper, Range } from '../helpers/dateHelper';
import { RoundHelper } from '../helpers/roundHelper';

@Injectable({
  providedIn: 'root',
})
export class PointsService {

  // todayChanged$: Subject<Date> = new Subject();
  pointsChanged$: Subject<Date> = new Subject();

  todayPoints: number = 0;
  daysHistory: HistoryEntries;
  focusHistory: FocusEntries;

  constructor(public ls: LocalStorage, public balance: BalanceService) {
    this.daysHistory = this.getAllHistory();
    this.focusHistory = this.getAllFocusEntries();
  }

  getAllHistory() {
    return this.ls.get(LocalStorage.HISTORY_ENTRIES_KEY) || {};
  }

  getHistoryAtDate(searchDate: string) {
    return this.getAllHistory()[searchDate] || {};
  }

  addPointsToDate(date: Date, points: number, type: PointsType): number {
    const searchDate = this.getSearchString(date);

    const pointsHistory = this.getHistoryAtDate(searchDate);
    if(!pointsHistory[type]) {
      pointsHistory[type] = 0;
    }

    // for focus
    if(type === 'focus') {
      const currentFocusPoints: number = pointsHistory[type];
      if(currentFocusPoints > 60) {
        const rewardForCurrentPoints = (currentFocusPoints - 60)
        const rewardPoints: number = rewardForCurrentPoints * (15/60)
  
        points += (points * ((rewardPoints / 100) + 1));
      }
    }

    points = RoundHelper.twoDecimals(points);
    pointsHistory[type] += points;

    this.daysHistory[searchDate] = pointsHistory;
    this.ls.set(LocalStorage.HISTORY_ENTRIES_KEY, this.daysHistory);

    this.pointsChanged$.next(date);
    this.balance.add(points, type);

    return points;
  }

  clearDayPoints(date: Date) {
    const searchDate = this.getSearchString(date);

    const dayEntry = this.daysHistory[searchDate];

    const totalPoints = dayEntry.focus + dayEntry.additional + dayEntry.habits;
    this.daysHistory[searchDate] = {
      focus: 0,
      habits: 0,
      additional: 0
    };

    this.focusHistory[searchDate] = [];

    this.ls.set(LocalStorage.HISTORY_ENTRIES_KEY, this.daysHistory);
    this.ls.set(LocalStorage.FOCUS_ENTRIES_KEY, this.focusHistory);
    this.balance.charge(totalPoints, 'clear day points');
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

  // saveFocusEntities(entities: FocusEntry[], date: Date): void {
  //   const searchDate = this.getSearchString(date);
  //   const todayFocus = this.getAllFocusEntriesAtDate(searchDate);

  //   entities.forEach(e => {
  //     todayFocus.push(e);
  //   })

  //   this.focusHistory[searchDate] = todayFocus;
  //   this.ls.set(LocalStorage.FOCUS_ENTRIES_KEY, this.focusHistory);
  // }

  saveFocusEntity(entry: FocusEntry, date: Date): void {
    const searchDate = this.getSearchString(date);
    const todayFocus = this.getAllFocusEntriesAtDate(searchDate);

    todayFocus.push(entry);

    this.focusHistory[searchDate] = todayFocus;
    this.ls.set(LocalStorage.FOCUS_ENTRIES_KEY, this.focusHistory);
  }

  getHistoryFromRange({start, end}: Range): HistoryRange {
    const focus = [];
    const habits = [];
    const additional = [];

    let iteratedDate = new Date(start);
    let iterateTo =  new Date(end);
    iterateTo.setDate(iterateTo.getDate() + 1);



    while(iteratedDate <= iterateTo) {
      const currentStats: PointsEntry = this.getSelectedDayHistory(iteratedDate)
      console.log('-----> iteratedDate', iteratedDate);
      console.log('-----> currentStats', currentStats);

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

  public addRewardsForLongConcentration(points: number, totalMins: number): number {

    if(totalMins > 60) {
      const rewardedMins = totalMins - 60;
      const additionalPoints = rewardedMins * (15/60); // 15 points for each new hour
  
      return points + additionalPoints;
    }
    return points;

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
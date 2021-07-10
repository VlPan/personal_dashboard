import { Formatter } from './timeFormatter';

export class DateHelper {

  static dateLabelsMap = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  static convertToFirstMondayOrder(dayNumber: number): number {
    if(dayNumber === 0) {
      return 6;
    } else {
      return dayNumber - 1;
    }
  }

  static generateDateString(date: Date) {
    const specificDay = new Date(date).getDate();
    const specificMonth = new Date(date).getMonth();
    const specificYear = new Date(date).getFullYear();

    const searchString = `${specificMonth}/${specificDay}/${specificYear}`;

    return searchString;
  }

  static generateShortDateString(date: Date) {
    const specificDay = new Date(date).getDate();
    const specificMonth = new Date(date).getMonth();

    const searchString = `${specificMonth + 1}/${specificDay}`;

    return searchString;
  }

  static generateLongDateString(date: Date) {
    const specificDay = new Date(date).getDate();
    const specificMonth = new Date(date).getMonth();
    const currentYear = Formatter.formatTimeNumber(date.getFullYear());

    const searchString = `${specificMonth + 1}/${specificDay}/${currentYear}`;

    return searchString;
  }

  static generateFormattedDateString(date: Date) {
    const currentDay = Formatter.formatTimeNumber(date.getDate());
    const currentMonth = Formatter.formatTimeNumber(date.getMonth() + 1);
    const currentYear = Formatter.formatTimeNumber(date.getFullYear());

    return `${currentMonth}/${currentDay}/${currentYear}`;
  }

  static isDatesEqual(date1: Date, date2: Date) {
    return this.generateDateString(date1) === this.generateDateString(date2);
  }

  static getStartOfTheMonth(date: Date): Date {
    const today = date.getDate(); 
    let start: Date = new Date(date);
    start.setDate(date.getDate() - today);

    return start;
  }

  static getClosestPrevMonday(date: Date): Date {
    const today = date.getDay(); 
    let monday: Date = new Date();

    if(date.getDay() == 0){
      monday.setDate(date.getDate() - 6);
    }
    else{
      monday.setDate(date.getDate() - (today-1));
    }

    return monday;
  }

  static getLabelsForRange({start, end}: Range) {

    const shouldShowWeekLabels: boolean = (end.getTime() - start.getTime()) < 1000 * 60 * 60 * 24 * 6;

    let iteratedDate = new Date(start);
    let iterateTo =  new Date(end);
    iterateTo.setDate(iterateTo.getDate() + 1);

    const isDifferentYears: boolean = iteratedDate.getFullYear() !== iterateTo.getFullYear();

    const result = [];
    while(iteratedDate <= iterateTo) {
      if(!isDifferentYears) {
        result.push(shouldShowWeekLabels ? this.getWeekLabel(iteratedDate) : this.generateShortDateString(iteratedDate))
      } else {
        result.push(this.generateLongDateString(iteratedDate))
      }

      iteratedDate.setDate(iteratedDate.getDate() + 1);
    }

    return result;
  }

  static getWeekLabel(date: Date) {
    return this.dateLabelsMap[date.getDay()]
  }
}

export interface Range {
  start: Date;
  end: Date;
}
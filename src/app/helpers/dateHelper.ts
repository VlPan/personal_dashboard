import { Formatter } from './timeFormatter';

export class DateHelper {

  static dateLabelsMap = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // static today: Date = new Date();
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

  static getClosestMonday(date: Date): Date {
    const today = date.getDay(); 
    let monday: Date = new Date(date);
    monday.setDate(date.getDate() - (today - 1)); // -1 to get Monday

    console.log('----->monday ', monday);
    return monday;
  }

  static getLabelsForRange({start, end}: Range) {
    let startDate = start.getDay();
    let endDate = end.getDay();

    console.log('%c-----> start', 'color: #eb0c2d', start);
    console.log('%c-----> end', 'color: #eb0c2d', end);


    if((end.getTime() - start.getTime()) < 1000 * 60 * 60 * 24 * 7) {
      return this.dateLabelsMap.slice(startDate, endDate + 1);
    }

    startDate = start.getDate();
    endDate = end.getDate();
    const result = [];
    const dateToIterate = new Date(start);
    for(let i = 0; i < endDate - startDate; i++) {
      result.push(this.generateShortDateString(dateToIterate))

      dateToIterate.setDate(start.getDate() + i);
    }


    return result;
  }
}

export interface Range {
  start: Date;
  end: Date;
}
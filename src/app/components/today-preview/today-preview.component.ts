import { FocusEntry } from './../../models';
import { PointsEntry, PointsService } from 'src/app/services/points.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Formatter } from 'src/app/helpers/timeFormatter';
import Chart from 'chart.js/auto';
import { DateHelper } from 'src/app/helpers/dateHelper';
import { FormControl } from '@angular/forms';
import { DateControlService } from 'src/app/services/date-control.service';

@Component({
  selector: 'app-today-preview',
  templateUrl: './today-preview.component.html',
  styleUrls: ['./today-preview.component.scss'],
})
export class TodayPreviewComponent implements OnInit {
  selectedDay: string = '';
  todayPoints: number = 0;
  todayHistory: PointsEntry | undefined;
  chart: any;

  date: FormControl;

  constructor(
    private pointService: PointsService,
    public dateControl: DateControlService,
    public cd: ChangeDetectorRef
  ) {
    this.date = new FormControl(dateControl.today);
  }

  @ViewChild('dayPoints') dayPoints!: ElementRef;

  ngOnInit() {
    this.updateSelectedDayPoints(this.date.value);  
    this.updateSelectedDayHistory(this.date.value);
    this.handleSelectedDay();

    this.pointService.pointsChanged$.subscribe((date: Date) => {
      this.updateSelectedDayPoints(date);
      this.updateSelectedDayHistory(date);

      this.updateChartData(date);
    });

    this.date.valueChanges.subscribe((date: Date) => {
      this.handleSelectedDay();
      this.updateSelectedDayPoints(date);
      this.updateSelectedDayHistory(date);

      this.updateChartData(date);
    });
  }

  ngAfterViewInit() {
    console.log('-----> dayPoints', this.dayPoints);

    const canvas = this.dayPoints.nativeElement.getContext('2d');

    const data = {
      labels: ['Focus', 'Habits', 'Additional'],
      datasets: [
        {
          label: 'Points',
          data: [
            this.todayHistory?.focus,
            this.todayHistory?.habits,
            this.todayHistory?.additional,
          ],
          backgroundColor: ['#f8b316', '#617fde', 'rgb(76,187,23)'],
          hoverOffset: 4,
        },
      ],
    };
    this.chart = new Chart(canvas, {
      type: 'pie',
      data,
    });

    console.log('-----> chart', this.chart);
  }

  handleSelectedDay() {
    this.selectedDay = DateHelper.generateFormattedDateString(this.date.value);
  }

  clearToday() {
    this.pointService.clearDayPoints(this.date.value);
  }

  updateChartData(date: Date) {
    const shouldUpdate: boolean = DateHelper.isDatesEqual(
      this.date.value,
      date
    );
    if (shouldUpdate) {
      this.chart.data.datasets[0].data = [
        this.todayHistory?.focus,
        this.todayHistory?.habits,
        this.todayHistory?.additional,
      ];
      this.chart.update();
    }
  }

  updateSelectedDayPoints(date: Date) {
    const shouldUpdate: boolean = DateHelper.isDatesEqual(
      this.date.value,
      date
    );
    if (shouldUpdate) {
      this.todayPoints = this.pointService.getSelectedDayPoints(date);
    }
  }

  updateSelectedDayHistory(date: Date) {
    const shouldUpdate: boolean = DateHelper.isDatesEqual(
      this.date.value,
      date
    );
    if (shouldUpdate) {
      this.todayHistory = this.pointService.getSelectedDayHistory(date);
    }
  }

  get isToday(): boolean {
    return DateHelper.isDatesEqual(this.date.value, new Date);
  }
}

import { HistoryRange, PointsService } from 'src/app/services/points.service';
import { DateControlService } from './../../services/date-control.service';
import { DateHelper } from 'src/app/helpers/dateHelper';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  chart: any;

  canvasWidth: number = 400;
  
  @ViewChild('historyChart') historyChart!: ElementRef;

  constructor(private dateControl: DateControlService, private pointsService: PointsService) { 
    this.range.controls.start.setValue(DateHelper.getClosestPrevMonday(this.dateControl.today));
    this.range.controls.end.setValue(dateControl.today);
  }

  ngOnInit() {
    // this.updateChart();
    this.range.valueChanges.subscribe(() => {
      if(this.range.controls.start.value && this.range.controls.end.value) {
        this.updateChart();
      }
    });

    this.pointsService.pointsChanged$.subscribe(() => {
      this.updateChart();
    })
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  drawChart() {
    const labels = DateHelper.getLabelsForRange(
      {
        start: this.range.controls.start.value,
        end: this.range.controls.end.value,
      }
    );

    const historyRange: HistoryRange = this.pointsService.getHistoryFromRange(
      {
        start: this.range.controls.start.value,
        end: this.range.controls.end.value,
      }
    )

    console.log('-----> historyRange', historyRange);
    console.log('-----> focus', historyRange.focus);
    console.log('-----> habits', historyRange.habits);
    console.log('-----> additional', historyRange.additional);

    const data = {
      labels,
      datasets: [
        {
          label: 'focus',
          data: historyRange.focus,
          backgroundColor: '#f8b316'
        },
        {
          label: 'habits',
          data: historyRange.habits,
          backgroundColor: '#617fde',
        },
        {
          label: 'additional',
          data: historyRange.additional,
          backgroundColor: 'rgb(76,187,23)'
        },
      ],
    };

    const canvas = this.historyChart.nativeElement.getContext('2d');
    this.chart = new Chart(canvas, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    });

  }

  updateChart() {
    const start = this.range.controls.start.value;
    const end = this.range.controls.end.value;
    const labels = DateHelper.getLabelsForRange(
      {
        start,
        end
      }
    );

    console.log('-----> labels', labels);

    if(labels.length > 31) {
      this.canvasWidth = 800;
    } else if(labels.length > 7) {
      this.canvasWidth = 600;
    } else {
      this.canvasWidth = 400;
    }

    const data: HistoryRange = this.pointsService.getHistoryFromRange(
      {
        start: this.range.controls.start.value,
        end: this.range.controls.end.value,
      }
    )

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data.focus;
    this.chart.data.datasets[1].data = data.habits;
    this.chart.data.datasets[2].data = data.additional;

    this.chart.update();

  }
  
}

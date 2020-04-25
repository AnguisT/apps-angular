/*
 http://www.chartjs.org/docs/ - DOCUMENTATION
 http://valor-software.com/ng2-charts/ - NG WRAPPER
 */
import {Component, ViewChild, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import "chart.js/src/chart.js";
import {MisrSearchService} from "../../../services/viewsearch/misr.service";
@Component({
  selector: 'chart',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class ChartComponent {
  @Input() lineChartData;
  @Input() lineChartLabels;
  @Input() lineChartColors;
  @Input() chartAxisNames:any[];
  @Input() chartName:string;
  @Input() showButtons;
  @Output() eventClicked:EventEmitter<any> = new EventEmitter();
  @Output() eventHovered:EventEmitter<any> = new EventEmitter();

  private _chartName;
  private _xAxis = '';
  private _yAxis = '';
  private _showButtons = true;
  public lineChartLegend:boolean;
  public lineChartType:string;
  public lineChartOptions:any;

  ngOnInit() {
    if(this.chartName) {
      this._chartName = this.chartName;
    } else {
      this._chartName = 'Chart';
    }
    this._xAxis = (this.chartAxisNames && this.chartAxisNames.length > 0? this.chartAxisNames[0] : '');
    this._yAxis = (this.chartAxisNames && this.chartAxisNames.length > 1? this.chartAxisNames[1] : '')

    this.lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: this._xAxis
            }
          }],
          yAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: this._yAxis
            }
          }]
        }
      };
    this.lineChartLegend = true;
    this.lineChartType = 'line';
  }



  // events
  public chartClicked(e:any):void {
    this.eventClicked.emit(e);
  }

  public chartHovered(e:any):void {
    this.eventHovered.emit(e);
  }

  changeChartType(type) {
    this.lineChartType = type;
  }
}

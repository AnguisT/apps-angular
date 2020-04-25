import {
  Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, Input, Output,
  EventEmitter, ViewChild
} from '@angular/core';
import 'style-loader!jointjs/dist/joint.min.css';
import {MisrSearchService} from "../../../../services/viewsearch/misr.service";
import "chart.js/src/chart.js";
@Component({
  moduleId: 'chart',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss',
    '../../../../modules/styles/index.scss'
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [
    MisrSearchService
  ]
})
export class ChartDashComponent {

  constructor(private misrService: MisrSearchService,
              private cd: ChangeDetectorRef) {
  }

  @Input() chartAxisNames:any[];
  @Input() chartName:string;
  @Input() showButtons;
  @Input() selectedType;
  @Output() eventClicked:EventEmitter<any> = new EventEmitter();
  @Output() eventHovered:EventEmitter<any> = new EventEmitter();
  @ViewChild('overlay') private overlay: any;
  @ViewChild('cahartwrapper') private cahartwrapper: any;

  private lineChartData = [{data: [], label: 'Ready'}, {data: [], label: 'Warning'}, {data: [], label: 'Problem'}];
  private lineChartLabels = [''];
  private lineChartColors = [{ // Ready
    backgroundColor: '#5cb85c',
    borderColor: '#3f7e3f',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
    { // Warning
      backgroundColor: '#ffb84c',
      borderColor: '#885300',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // Error
      backgroundColor: '#ff8884',
      borderColor: '#a13232',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];
  private _chartName;
  private _xAxis = '';
  private _yAxis = '';
  private _showButtons = true;
  public lineChartLegend:boolean;
  public lineChartType:string;
  public lineChartOptions:any;

  ngOnInit() {
    //this.overlay.show(this.cahartwrapper.nativeElement);
    this.loadDataForChart(null);
  }

  initChart() {
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
    if(this.selectedType) {
      this.lineChartType = this.selectedType;
    }
    //this.overlay.hide(this.cahartwrapper.nativeElement);
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

  loadDataForChart(params) {
    let self = this;
    this.misrService.getChartData(params).subscribe(
      (res) => {
        if(res && res.length>0) {
          var tmpLabels = [];
          var tmpDataArr = [];
          var tmpReadyCount = {data: [], label: 'Ready'};
          var tmpWarnCount = {data: [], label: 'Warning'};
          var tmpErrorCount = {data: [], label: 'Problem'};
          for (var i = 0; i < res.length; i++) {
            tmpLabels.push(res[i].Period);
            tmpReadyCount.data.push(res[i].ReadyCount);
            tmpWarnCount.data.push(res[i].WarnCount);
            tmpErrorCount.data.push(res[i].ErrorCount);
          }
          tmpDataArr.push(tmpReadyCount);
          tmpDataArr.push(tmpWarnCount);
          tmpDataArr.push(tmpErrorCount);
          var tmpColors = [
            { // Ready
              backgroundColor: '#5cb85c',
              borderColor: '#3f7e3f',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            },
            { // Warning
              backgroundColor: '#ffb84c',
              borderColor: '#885300',
              pointBackgroundColor: 'rgba(77,83,96,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(77,83,96,1)'
            },
            { // Error
              backgroundColor: '#ff8884',
              borderColor: '#a13232',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            }
          ];
          self.lineChartData = tmpDataArr;
          self.lineChartLabels = tmpLabels;
          self.lineChartColors = tmpColors;
          self.cd.markForCheck();
        } else {
          var tmpReadyCount = {data: [], label: 'Ready'};
          var tmpWarnCount = {data: [], label: 'Warning'};
          var tmpErrorCount = {data: [], label: 'Problem'};
          var tmpColors = [
            { // Ready
              backgroundColor: '#5cb85c',
              borderColor: '#3f7e3f',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            },
            { // Warning
              backgroundColor: '#ffb84c',
              borderColor: '#885300',
              pointBackgroundColor: 'rgba(77,83,96,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(77,83,96,1)'
            },
            { // Error
              backgroundColor: '#ff8884',
              borderColor: '#a13232',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            }
          ];

          self.lineChartData = [tmpReadyCount,tmpWarnCount, tmpErrorCount];
          self.lineChartLabels = [''];
          self.lineChartColors = tmpColors;
          self.cd.markForCheck();
        }
        self.initChart();
      }
    );
  }
}

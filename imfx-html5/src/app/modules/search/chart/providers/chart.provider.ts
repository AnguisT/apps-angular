import * as $ from "jquery";
import {Inject, Injectable} from '@angular/core';
import {ChartConfig} from "../chart.config";
import {Observable, Subscription} from "rxjs";
import {ThumbColumnModule} from 'app/modules/search/grid/comps/columns/thumb';


export interface ChartProviderInterface {
    config: ChartConfig;
    selectedChannel;
    selectedType;
    /*
    * load Data For Chart
    */
    loadDataForChart(params): void;
    /*
    * select filter
    */
    selectParam(e, type): void
}
@Injectable()
export class ChartProvider implements ChartProviderInterface {
    config: ChartConfig;
    selectedChannel = "";
    selectedType = "";
    loadDataForChart(params): void {
        let self = this;
        this.config.options.service.getChartData(params).subscribe(
            (res: any) => {
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
                    self.config.options.lineChartColors = tmpColors;
                    self.config.options.lineChartData = tmpDataArr;
                    self.config.options.lineChartLabels = tmpLabels;
                    self.config.options.chartData = {
                        cd: self.config.options.lineChartData, 
                        cl: self.config.options.lineChartLabels, 
                        cc: self.config.options.lineChartColors
                    };
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
                    self.config.options.chartData = {
                        cd: [tmpReadyCount,tmpWarnCount, tmpErrorCount], 
                        cl: [''], 
                        cc: tmpColors};
                }
            }
        );
    }
    selectParam(e, type): void {
        if(type) {
            this.selectedType = e.target.value;
        } else {
            this.selectedChannel = e.target.value;
        }
        let paramsObject = {
            channel: this.selectedChannel, 
            form: this.selectedType
        };
        this.loadDataForChart(paramsObject);
    }
}

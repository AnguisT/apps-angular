import {
    Input,
    Component,
    ViewEncapsulation
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'grid-column-status-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class StatusColumnComponent implements AgRendererComponent {
    private params:any;
    private status:string;
    
    @Input('params') set setParams(params) {
        this.params = $.extend(true, this.params, params);
    }
    ngOnInit() {
        this.setStatus(this.params.value);
    }
    // called on init
    agInit(params:any):void {
        this.params = params;
     //   this.setStatus(this.params.value);
    }

    // called when the cell is refreshed
    refresh(params:any):void {
        this.params = params;
        this.setStatus(this.params.value);
    }

    private setStatus(status:string) {
        if (status.toLowerCase().indexOf("in")+1) {
          this.status = "on";
        }
        if (status.toLowerCase().indexOf("out")+1) {
          this.status = "off";
        }
        if (status.toLowerCase().indexOf("failed")+1) {
          this.status = "off";
        }
        if (status.toLowerCase().indexOf("error")+1) {
          this.status = "off";
        }
        if (status.toLowerCase().indexOf("ready")+1) {
          this.status = "on";
        }
        if (status.toLowerCase().indexOf("not in")+1 || status.toLowerCase().indexOf("no media")+1) {
          this.status = "off";
        }
        if (status.toLowerCase().indexOf("missing")+1) {
          this.status = "";
        }
    }
}


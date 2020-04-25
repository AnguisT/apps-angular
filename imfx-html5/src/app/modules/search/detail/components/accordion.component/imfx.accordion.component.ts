/**
 * Created by initr on 03.11.2016.
 */

import {Component, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {Pipe, PipeTransform} from '@angular/core';


@Component({
  selector: 'accordion-block',
  templateUrl: './tpl/index.html',
  styleUrls: [
    '../../../grid/comps/columns/thumb/styles/index.scss',
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class IMFXAccordionComponent {
    @Input() file:Object;
    @Input() groups:any = [];
    @Input() friendlyNames:Object;
    @Output() contentReadyEvent:EventEmitter<any> = new EventEmitter();
    private _open: true;
    private r_params = this.route.params;
    private statusConfig = {
        value: null
    }
    private params = {
        showAllProperties: false
    };

    constructor(private route: ActivatedRoute) {
      this._open = true;
    }

    ngOnInit() {
        this.statusConfig.value = this.file['Status_text'];
    }

    ngAfterViewInit(){
        this.afterContentLoaded();
    }

    afterContentLoaded() {
      var self = this;
      setTimeout(function(){self.contentReadyEvent.emit(),0});
    }

    /*
    *Show/Hide empty properties
    */
    clickShowAllProperties($event) {
        $event.stopPropagation();
        $event.preventDefault();
        this.params.showAllProperties = !this.params.showAllProperties;
    }
    getTypeOf(prop){
        if(prop === null) {
            return "null";
        }
        if(Array.isArray(prop)) {
            return "array";
        }
        return typeof prop;
    }

    isEmpty(data) {
        if (data === '' || data === undefined || data === null) {
            return true;
        }
        return false;
    }
    refresh(data) {
      this.file = data;
    }
}

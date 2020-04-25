import {
  Component,
  Input,
  Output,
  ViewEncapsulation,
  ViewChild,
  EventEmitter, ChangeDetectorRef
} from '@angular/core';

import * as $ from 'jquery';
import {AdvancedSearch} from "../../../../services/viewsearch/advanced.search.service";

import {QueueSearchParams} from "../../model/queue.search.params";

@Component({
  selector: 'queue-params-component',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  providers: [
    AdvancedSearch
  ],
  encapsulation: ViewEncapsulation.None
})
export class QueueParamsComponent {
  @ViewChild('listParams') private listParams: any;
  @ViewChild('overlay') private overlay: any;
  private response: any = [];
  private showCompleted: boolean = false;
  private showError: boolean = false;
  private selectAll: boolean = false;
  private error: boolean = false;

  private services: any = [];

  @Output() onSelectParam: EventEmitter<any> = new EventEmitter<any>();

  constructor(private advancedSearch: AdvancedSearch,
              private cdr: ChangeDetectorRef
  ) {

  }


  ngOnInit(){
    let self = this;
      // /*debugger*/;
      // for (var i in res) {
      //   this.services.push({
      //     id: i,
      //     title: res[i]
      //   })
      // }
      // this.cdr.detectChanges();

      //side spinner displaying is incorrect
      // setTimeout(() => self.overlay.show(self.listParams.nativeElement));
  }

  ngAfterViewInit() {
    let self = this;
    this.getQueueParams();
  }

  getQueueParams() {
    let self = this;
    setTimeout(() => {
      this.advancedSearch.getQueueManagerServices().subscribe((res) => {
        for (var i in res) {
          this.services.push({
            id: i,
            title: res[i].Name
          });
        }
        //side spinner displaying is incorrect
        // self.overlay.hide(self.listParams.nativeElement);
      });
    });
    this.cdr.detectChanges();
  }

  isError($event) {
    if ($event) {
      this.error = true;
    }
  }

  clickRepeat() {
    let self = this;
    this.overlay.show(this.listParams.nativeElement);
    setTimeout(() => {
      self.getQueueParams();
    }, 2000);
  }

    setCompleted(value: boolean[]) {
        if(this.showCompleted != value[0]){
            this.showCompleted = value[0];
        }
        if(this.showError != value[1]){
            this.showError = value[1];
        }
    }

    setCreatedDateOffset(value: null){
        if(this.showCompleted != value){
            this.showCompleted = value;
            this.emitSelection();
        }
    }

   onToggleCompleted() {
      this.showCompleted = !this.showCompleted;
      this.emitSelection();
   }
   onToggleError() {
      this.showError = !this.showError;
      this.emitSelection();
   }
   onToggleSelectAll(val:boolean = null, silent = false) {
      this.selectAll = val != null ? val : !this.selectAll;
      for (var s of this.services) {
        s.selected = this.selectAll;
      }
      if(!silent){
          this.emitSelection();
      }
   }

   deselectAll(silent){
      this.onToggleSelectAll(false, silent);
   }

    setCheckboxes(values: string[]){
      this.deselectAll(false);
      let countSelected = 0;
      this.services.forEach((item,k) => {
        if(values.indexOf(item.id) > -1){
            countSelected++;
            this.services[k].selected = true;
        }
      });
      this.selectAll = countSelected==this.services.length?true:false;
    }


   emitSelection() {
      this.onSelectParam.emit({
        queueParams: this.getParams()
      });
       this.selectAll = this.services.every((el) => {return el.selected == true;})
   }

   getParams(): QueueSearchParams {
    return {
      showCompleted: this.showCompleted,
      showError: this.showError,
      selectAll: this.selectAll,
      services: this.services.filter(el=>el.selected)
    }
   }
}

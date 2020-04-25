/**
 * Created by Pavel on 25.04.2017.
 */

import { Directive, ElementRef, Input } from '@angular/core';
import {NgModel} from "@angular/forms";
@Directive({
  selector: '[tristate]',
  providers: [NgModel],
  host: {
    '(ngModelChange)' : 'onInputChange($event)'
  }
})
export class TristateDirective {
  @Input() enableTristate: boolean;

  constructor(private el: ElementRef, private model:NgModel) {
    this.updateIndeterminate();
  }

  onInputChange(event){
    this.updateIndeterminate();
  }

  updateIndeterminate() {
    setTimeout(()=>{
      let indeterminate = !(typeof this.model.value == "boolean");
      this.el.nativeElement.indeterminate = this.enableTristate ? indeterminate : false;
      // this.el.nativeElement.indeterminate = true;
    })
  }

}

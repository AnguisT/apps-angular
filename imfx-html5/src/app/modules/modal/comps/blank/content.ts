/**
 * Created by Sergey Trizna on 30.03.2017.
 */
import {Component, Injector, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'modal-blank-content',
    template: `
    <div>
      <h1>Blank</h1>
    </div>
    `,
    encapsulation: ViewEncapsulation.None
})
export class ModalBlankContentComponent {
    data: any;
    constructor(private injector: Injector){
        this.data = this.injector.get('data');
    }
}

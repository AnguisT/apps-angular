import {
    Component,
    ViewEncapsulation,
    ElementRef
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AgRendererComponent } from 'ag-grid-ng2/main';

@Component({
    selector: 'input-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class InputComponent implements AgRendererComponent {
    private params: any;
    private text: any;
    private viewMulti: boolean;

    constructor( private elementRef: ElementRef) {
      Observable.fromEvent(elementRef.nativeElement, 'keyup')
        .debounceTime(1000)
        .subscribe(kEvent => {
          this.onKeyPress();
        });
    }

    // called on init
    agInit(params: any): void {
        this.params = params;
        this.text = params.data.Notes;
        this.viewMulti = true;
    }

    // called when the cell is refreshed
    refresh(params: any): void {
        this.params = params;
        this.text = params.data.Notes;
        this.viewMulti = true;
    }
    onKeyPress(): void {
        if (this.text != '') {
          this.params.context && this.params.context.componentParent.addNote(this.text);
        }
    }
}


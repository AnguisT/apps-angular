/**
 * Created by Sergey Trizna on 30.03.2017.
 */
import {Component, Injector, ChangeDetectorRef, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'modal-error-content',
    templateUrl: './tpl/content.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../styles/index.scss']
})
export class ModalErrorContentComponent {
    data: any;
    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef
    ){
        this.data = this.injector.get('data');
    }
    private text: string;
    setText(text: string){
        this.text = text;
        this.cdr.detectChanges();
    }
}

/**
 * Created by Sergey Trizna on 30.03.2017.
 */
import {Component, Injector, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'modal-success-content',
    templateUrl: './tpl/content.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../styles/index.scss']
})
export class ModalSuccessContentComponent {
    private text: string;
    data: any;

    constructor(private injector: Injector) {
        this.data = this.injector.get('data');
    }

    setText(text: string) {
        this.text = text;
    }
}

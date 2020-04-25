import {
    Component, Injector, ChangeDetectorRef, ViewEncapsulation, Output, EventEmitter
} from '@angular/core';

@Component({
    selector: 'modal-confirm-content',
    templateUrl: './tpl/content.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../styles/index.scss']
})
export class ModalConfirmContentComponent {
    private title: string;
    private titleParams: Object = {};
    private text: string;
    private textParams: Object = {};
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    data: any;

    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef) {
        this.data = this.injector.get('data');
        this.title = this.data.config.options.modal.title.name;
    }

    setTitle(title: string, params: Object = {}) {
        this.title = title;
        this.titleParams = params;
        this.cdr.detectChanges();
    }

    setText(text: string, params: Object = {}) {
        this.text = text;
        this.textParams = params;
        this.cdr.detectChanges();
    }

    ok() {
        this.hide();
        this.onOk.emit();
    }

    hide() {
        this.data.refs.modal.hide();
    }

    cancel() {
        this.hide();
        this.onCancel.emit();
    }
}

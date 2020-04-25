/**
 * Created by Sergey Trizna on 30.03.2017.
 */
import {Component, Injector, ViewEncapsulation, Output, EventEmitter, ViewChild, ChangeDetectorRef} from '@angular/core';

@Component({
    selector: 'modal-prompt-content',
    templateUrl: './tpl/content.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../styles/index.scss']
})
export class ModalPromptContentComponent {
    private title: string;
    private label: string;
    private error: string;
    private placeholder: string = 'common.input_name';
    @ViewChild('promptInput') promptInputRef: any;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    data: any;

    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef) {
        this.data = this.injector.get('data');
    }

    setTitle(title: string) {
        this.title = title;
        this.cdr.detectChanges();
    }

    setLabel(label: string) {
        this.label = label;
        this.cdr.detectChanges();
    }

    setError(error: string) {
        this.error = error;
        this.cdr.detectChanges();
    }
    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        this.cdr.detectChanges();
    }

    ok($event) {
        let val = this.promptInputRef.nativeElement.value;
        if(!val){
            this.error = 'common.error_need_value';
        } else {
            return this.onOk.emit({ref: this.promptInputRef, val: val});
        }
    }

    hide(){
        this.promptInputRef.nativeElement.value = "";
        this.error = null;
        this.data.refs.modal.hide();
        this.cdr.detectChanges();
        this.onCancel.emit();
    }
}

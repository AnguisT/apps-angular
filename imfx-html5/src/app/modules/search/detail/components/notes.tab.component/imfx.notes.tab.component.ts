import {Component, ViewEncapsulation, Input, Injectable, Inject} from '@angular/core'
import {FormControl} from '@angular/forms';

@Component({
    selector: 'imfx-notes-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
@Injectable()
export class IMFXNotesTabComponent {
    config: any;

    constructor() {}
    ngOnInit() {}
    ngAfterViewInit() {
        this.config.fileNotes = this.config.fileNotes || this.config.file && (this.config.file.DESCRIPTION || this.config.file.NOTES);
    }
    refresh(fileNotes, readOnly?: boolean) {
        if (readOnly != null) {
            this.config.readOnly = readOnly;
        };
        this.config.fileNotes = fileNotes;
    }
    save() {
        return this.config.fileNotes;
    }
}

import { Injectable, EventEmitter } from '@angular/core';
import { HttpService } from '../http/http.service';
import { LocalStorageService } from 'ng2-webstorage';
@Injectable()
export class ClipEditorService {
    public onAddToMediaList: EventEmitter<any> = new EventEmitter<any>();
    private itemToAdd;

    private ceTypes = ['Media', 'Version'];
    private selectedRows: Array<any> = [];
    private isAudioField: boolean = false; // by default in wizard setups selected video
    private editorType: string = 'Version';
    private urlParse;

    constructor(private http: HttpService,
                private localStorage: LocalStorageService) {
      this.selectedRows = this.localStorage.retrieve('clip.editor.selectedRows');
      this.isAudioField = this.localStorage.retrieve('clip.editor.isAudio');
    }

    public setSelectedRows(selectedRows: Array<any>): void {
        this.selectedRows = selectedRows;
        this.localStorage.store('clip.editor.selectedRows', selectedRows);
    }

    public getSelectedRows(): Array<any> {
        this.selectedRows = this.localStorage.retrieve('clip.editor.selectedRows');
        return this.selectedRows != null ? this.selectedRows.sort((a, b) => a.TV_NUM - b.TV_NUM) : this.selectedRows;
    }

    public setIsAudio(isAudio: boolean) {
        this.isAudioField = isAudio;
        this.localStorage.store('clip.editor.isAudio', isAudio);
    }

    public setClipEditorType(editorType: string) {
      this.editorType = editorType;
      this.localStorage.store('clip.editor.type', editorType);
    }

    public getClipEditorType() {
      let self = this;
      this.urlParse = window.location.hash.split('/');
      this.ceTypes.forEach( el => {
        if ( self.urlParse.indexOf(el.toLocaleLowerCase()) > -1 ) {
          self.editorType = el;
        };
      });
      return this.editorType;
    }

    public isAudio() {
        this.isAudioField = this.localStorage.retrieve('clip.editor.isAudio');
        return this.isAudioField;
    }

    getSequence(versionId: number) {
        return this.http.get('/api/int/version/' + versionId + '/mediasequence').map((resp) => {
            return resp.json();
        });
    }

    addToMediaList(item: any): void {
      this.onAddToMediaList.emit(item);
    }

    public prepareItemToMediaList(data) {
      this.itemToAdd = data;
    }

    public getItemForAddToMediaList() {
      return this.itemToAdd;
    }
}

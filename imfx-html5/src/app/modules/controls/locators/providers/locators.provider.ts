import { EventEmitter, Output, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
@Injectable()
export class LocatorsProvider {
    @Output() onGetMediaTaggingForSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSavedMediaTagging: EventEmitter<any> = new EventEmitter<any>();
    @Output() onReloadMediaTagging: EventEmitter<any> = new EventEmitter<any>();
    config: any;
    saveValid: boolean = false;
    constructor() {
    }
    getMediaTagging(id): Observable<Subscription> {
      let self = this;
      return Observable.create((observer) => {
        self.config.options.service.getDetailMediaTagging(id);
      });
    }
    /**
     * Calling on Save button clicking.
     */
    getMediaTaggingForSave(): any {
     //   this.onGetMediaTaggingForSave.emit();
    }

    /**
     * Sent request for saving media tagging
     */
    saveMediaTagging(res, id): Observable<Subscription> {
      let self = this;
      return Observable.create((observer) => {
        self.config.options.service.saveMediaTagging(res, id)
          .subscribe(resp => {
            observer.next({
              resp: resp
            });
          });
     });
    }

    isSaveValid(): boolean {
        return this.saveValid;
    }
}

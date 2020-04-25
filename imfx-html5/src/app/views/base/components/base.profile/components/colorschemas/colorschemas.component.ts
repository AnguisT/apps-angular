import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {ServerStorageService} from "../../../../../../services/storage/server.storage.service";

@Component({
    selector: 'profile-colorschemas',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class ProfileColorSchemasComponent {
    private colorSchema: any;
    @Output() changedColorSchema: EventEmitter<any> = new EventEmitter<any>();

    constructor (private storageService: ServerStorageService){
    }
    private schemaChange(e){
        this.colorSchema = e.target.value;
        this.changedColorSchema.emit(this.colorSchema);
    }

    ngOnInit() {
      let self = this;
      this.storageService.retrieve(['color_schema']).subscribe((res)=>{
        if(res && res[0]) {
          self.colorSchema = res ? res[0] ? res[0].Value ? res[0].Value.replace(/\"/g,"") : "default" : "default" : "default";
        }
        else if(res && res['color_schema']) {
          self.colorSchema = res ? res['color_schema'] ? res['color_schema'].replace(/\"/g,"") : "default" : "default";
        }
        self.changedColorSchema.emit(self.colorSchema);
      });
    }
}


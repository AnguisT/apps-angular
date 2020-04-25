import {Injectable} from '@angular/core';
import {HttpService} from '../http/http.service';
import {Observable} from "rxjs";
import {Response} from "@angular/http";

import {AppSettings} from "../../../../modules/common/app.settings/app.settings";

@Injectable()
export class CarrierDetailAppSettings extends AppSettings {
    subtypes = {
        0:0,        //default
        1:1,        //Physical item
        100:5,      //Media File
        101:6,      //Subtile
        110:7,      //Archive
      //  150:      //Audio
        200:9       //Image
    }
    tabsType = {
        'None': 'None',
        'Notes': 'cNotes',
        'Metadata': 'cMetadata',
        'History': 'cHistory'
    }
}

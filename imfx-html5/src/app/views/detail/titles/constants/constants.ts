import {Injectable} from '@angular/core';
import {HttpService} from '../http/http.service';
import {Observable} from "rxjs";
import {Response} from "@angular/http";

import {AppSettings} from "../../../../modules/common/app.settings/app.settings";

@Injectable()
export class TitlesDetailAppSettings extends AppSettings {
    mediaSubtypes = {
        'Default':0,        //default
        'PhysicalItem':1,        //Physical item
        'Media':100,      //Media File
        'Subtile':101,      //Subtile
        'Archive':110,      //Archive
        'Audio': 150,      //Audio
        'Image':200,       //Image
        'Doc':[210,230]       //Doc
    };
    subtypes = {
        0:0,        //default
        1:1,        //Physical item
        100:5,      //Media File
        101:6,      //Subtile
        110:7,      //Archive
      //  150:      //Audio
        200:9       //Image
    };
    tabsType = {
        'None': 'None',
        'MediaTagging': 'mMediaTagging',
        'EventsActions': 'mEventsActions',
        'Attachements': 'mAttachements',
        'AssocMedia': 'mAssocMedia',
        'History': 'mHistory',
        'SegmentsAudioTracks': 'mSegmentsAudioTracks',
        'Notes': 'mNotes',
        'Metadata': 'mMetadata',
        'TasksReports': 'mTasksReports',
        'Misr': 'mMisr',
        'VideoInfo': 'mVideoInfo',
        'SubtitlesGrid': 'mSubtitlesGrid'
    }
}

/**
 * Created by Sergey Trizna on 27.04.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DownloadViewerComponent} from './download';
import {TranslateModule} from 'ng2-translate';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DownloadViewerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        DownloadViewerComponent
    ],
    entryComponents: []
})
export class DownloadViewerModule {
}

import {NgModule, ErrorHandler} from '@angular/core';
import {ModalModule} from '../../../app/modules/modal';
import {ErrorManager} from './error.manager';
@NgModule({
    declarations: [],
    imports: [
        ModalModule
    ],
    exports: [],
    providers: [
        ErrorManager,
        {provide: ErrorHandler, useClass: ErrorManager},
    ]
})
export class ErrorManagerModule {
}

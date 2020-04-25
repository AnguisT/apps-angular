import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { IsgView } from './isg.view';
import { IsgRoutingModule } from './isg.routing.module';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { LegalPersonISGComponent } from '../../../../dialogs/legal-person-isg/legal-person-isg.view';
import { DropdownModule } from '../../../../components';


@NgModule({
    declarations: [IsgView, LegalPersonISGComponent],
    imports: [IsgRoutingModule, SharedModule, MatIconModule, MatDialogModule],
    providers: [],
    entryComponents: [LegalPersonISGComponent]
})
export class IsgModule { }

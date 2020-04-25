/**
 * Created by Sergey Trizna on 17.12.2016.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXControlsTreeComponent} from './imfx.tree';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXControlsTreeComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    exports: [
        IMFXControlsTreeComponent,
    ]
})
export class IMFXControlsTreeModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { LocalDateGridComponent } from './local.date.component';

// Pipes
import { LocalDateModule } from '../../pipes/localDate/index';

@NgModule({
    declarations: [
        LocalDateGridComponent
    ],
    imports: [
        CommonModule,
        LocalDateModule
    ],
    exports: [
        LocalDateGridComponent
    ]
})
export class LocalDateGridModule {}

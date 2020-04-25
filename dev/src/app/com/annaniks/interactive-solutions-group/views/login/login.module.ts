import { NgModule } from '@angular/core';
import { LoginView } from './login.view';
import { SharedModule } from '../../shared';
import { LoginRoutingModule } from './login.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services';

@NgModule({
    declarations:[LoginView],
    imports:[SharedModule,LoginRoutingModule,ReactiveFormsModule],
    providers:[LoginService],
    exports:[]
})
export class LoginModule {

}
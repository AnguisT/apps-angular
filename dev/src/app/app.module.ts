import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { ApiService, AppService } from './com/annaniks/interactive-solutions-group/services';
import { CookieService } from 'angular2-cookie/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './com/annaniks/interactive-solutions-group/services/authguard.service';
import {MatTableModule} from '@angular/material/table';
import { ConfigurationService } from './com/annaniks/interactive-solutions-group/views/admin/configurations/configuration.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  exports: [
    MatTableModule,
  ],
  imports: [ 
    FormsModule,  
    MbscModule, 
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [ApiService, CookieService, AuthGuard, AppService, ConfigurationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

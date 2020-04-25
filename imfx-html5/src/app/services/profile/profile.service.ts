/**
 * Created by initr on 26.10.2016.
 */
import {ChangeDetectorRef, EventEmitter, Inject, Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {HttpService} from "../http/http.service";
import {SecurityService} from "../security/security.service";

import {Observable} from "rxjs";
import {ServerStorageService} from "../storage/server.storage.service";
import {ConfigService} from "../config/config.service";
import {Subject} from "rxjs/Subject";
import {LoginProvider} from "../../views/login/providers/login.provider";
import {LoginService} from "../login/login.service";
import * as Cookies from 'js-cookie';

/**
 * Profile service
 */
@Injectable()
export class ProfileService {
    storagePrefix = 'base.profile.data';
    colorSchemaChanged: EventEmitter<any> = new EventEmitter<any>();
    defaultPageChanged: EventEmitter<any> = new EventEmitter<any>();
    personalData: any;
    defaultPagePlain: string;
    defaultPage: EventEmitter<string> = new EventEmitter();

    constructor(public httpService: HttpService,
                private cdr: ChangeDetectorRef,
                private securityService: SecurityService,
                private storageService: ServerStorageService) {
      // debugger;
    }

    public retrieveDefaultPage() {
        this.storageService.retrieve(['default_page'], true).subscribe((resp) => {
            this.setDefaultPage(resp[0] && resp[0].Value && JSON.parse(resp[0].Value) || ConfigService.getSetupsForRoutes().main);
        })
    }

    public colorSchemaChange(schema) {
        this.colorSchemaChanged.next(schema);
    }

    public defaultPageChange(page) {
        // this.setDefaultPage(page); // if do set, app will navigate to this page after changing defaults in the profile page
        this.storageService.store('default_page', page).subscribe((res) => {
            this.defaultPageChanged.next(page);
        });
    }

    private setDefaultPage(p: string) {
        if (p) {
            this.defaultPagePlain = p;
        }
        this.defaultPage.emit(this.defaultPagePlain);
    }

    public SetPersonal(data) {
      this.personalData = data;
      this.cdr.detectChanges();
    }

    public GetPersonal(): Observable<Response> {
      return Observable.create((observer) => {
        if(!this.personalData) {
          this.storageService.retrieve(["personal_settings"], true).subscribe((res) => {
            if (res[0] && res[0].Value && res[0].Value.length > 0) {
              this.personalData = JSON.parse(res[0].Value);
            } else if(res['personal_data']) {
              this.personalData = res['personal_data'];
            }
            observer.next(this.personalData);
          });
        } else {
          observer.next(this.personalData);
        }
      });
    }
    /**
     * Returned info about user
     */
    getUserProfile(): Observable<Response> {
        // let data = this.storage.retrieve(this.storagePrefix);
        let datastr = Cookies.get('permissions');
        return Observable.create((observer) => {
            if (!datastr) {
                return this.httpService
                    .get(
                        // '/api/paragon/userprofile'
                        '/api/userprofile/0'
                    )
                    .map(resp => resp.json())
                    .subscribe(
                        (data) => {
                            if (!data.Permissions) {
                                data.Permissions = [];
                            };

                            Cookies.set('permissions', JSON.stringify(data), { expires: 1 });
                            // this.storage.store(this.storagePrefix, data);
                            this.securityService.setPermissions();
                            if(!this.personalData) {
                              this.storageService.retrieve(["personal_settings"], true).subscribe((res) => {
                                if (res[0].Value.length > 0) {
                                  this.personalData = JSON.parse(res[0].Value);
                                }
                                observer.next(data);
                              });
                            } else {
                              observer.next(data);
                            }

                        },
                        (err) => {
                            observer.error(err);
                        });
            } else {
                let data = JSON.parse(datastr);
                this.securityService.setPermissions(data.Permissions);
                observer.next(data);
            }
        });
    }
}


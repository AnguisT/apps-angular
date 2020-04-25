/**
 * Created by initr on 16.12.2016.
 */
import {Injectable} from '@angular/core';
import {HttpService} from '../http/http.service';
import {SessionStorageService} from 'ng2-webstorage';
import {Observable} from 'rxjs';
import {Response} from '@angular/http';
import {LookupsTypes} from "../system.config/search.types";
import {Select2ConvertObject, Select2ItemType} from "../../modules/controls/select2/types";
@Injectable()
export class LookupService {
    // private lookUps = {
    //     '14': ['FriendlyNames.TM_MIS',
    //         'FriendlyNames.TM_PG_RL'],
    //     '5': ['SearchSupportedOperators'],
    //     '10': ['AfdTypes'],
    //     '9': ['AspectRatioTypes']
    // }
    private prefixStorage= "lookups.";
    constructor(private httpService: HttpService,
                private sessionStorage: SessionStorageService) {
    }

    /**
     *
     * @param id
     * @returns {any}
     */
    public getLookups(id:LookupsTypes): Observable<any> {
        let data = this.sessionStorage.retrieve(this.prefixStorage + id);
        return Observable.create((observer) => {
                if (!data) {
                    let lookup = id.split('.')[0];
                    this.httpService.get('/api/lookups/' + lookup)
                        .map(res => res.json())
                        .subscribe(
                            (res) => {
                                let path = id.split('.');
                                let d = res;
                                for (let i in path) {
                                    d = d[path[i]];
                                }
                                this.sessionStorage.store(this.prefixStorage + id, d);
                                observer.next(d);
                            },
                            (err) => {
                                observer.error(err);
                            });

                } else {
                    observer.next(data);
                }
            }
        );
    };
    getLookupsAsync(ids:Array<LookupsTypes>) {
        let req = [];
        let resData = [];
        let _ids = [];
        for (let el of ids) {
            let data = this.sessionStorage.retrieve(this.prefixStorage + el);
            if (!data) {
                let lookup = el.split('.')[0];
                _ids.push(el);
                req.push(
                    this.httpService.get('/api/lookups/' + lookup)
                            .map(res => res.json())
                )
            }
            else{
                resData.push(data);
            }
        }
        return Observable.create((observer) => {
            if(req.length !== 0) {
                Observable.forkJoin(req).subscribe(
                    (res) => {
                        for (let i in res) {
                            let path = _ids[i].split('.');
                            let d = res[i];
                            for (let j in path) {
                                d = d[path[j]];
                            }
                            this.sessionStorage.store(this.prefixStorage + _ids[i], d);
                            resData.splice(ids.indexOf(_ids[i]), 0, d);
                        }
                        observer.next(resData);
                    },
                    (err) => {
                        observer.error(err);
                    });
            }
            else {
                observer.next(resData);
            }
        });
    };

    public getLookupRuleForConvertToSelect2Item(type: LookupsTypes): Select2ConvertObject {
        let conv: Select2ConvertObject;
        switch (type) {
            case 'Devices':
                conv = {
                    key: 'Id',
                    text: 'DvCode',
                };
                break;
            case 'CtnrFormats':
                conv = {
                    key: 'Id',
                    text: 'Name',
                };
                break;
            case 'ItemFormats':
                conv = {
                    key: 'Id',
                    text: 'Name',
                };
                break;
            case 'MediaFileTypes':
                conv = {
                    key: 'Id',
                    text: 'Name',
                };
                break;
            case 'Languages':
                conv = {
                    key: 'Id',
                    text: 'Value'
                };
                break;
            case 'AgeCertification':
                conv = {
                    key: 'Id',
                    text: 'Value'
                };
                break;
            case 'AudioMsTypes':
                conv = {
                    key: 'Id',
                    text: 'Value'
                };
                break;
            case 'AudioContentTypes':
                conv = {
                    key: 'Id',
                    text: 'Value'
                };
                break;
            case 'Countries':
                conv = {
                    key: 'Id',
                    text: 'Value'
                };
                break;
            case 'MediaEventTypes':
                conv = {
                    key: 'ID',
                    text: 'NAME'
                };
                break;
            case 'SegmentTypes':
                conv = {
                    key: 'ID',
                    text: 'NAME'
                };
                break;
            default:
                conv = {
                    key: 'ID',
                    text: 'Name'
                }
        }

        return conv;
    }
}

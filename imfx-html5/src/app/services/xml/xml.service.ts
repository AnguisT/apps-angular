/**
 * Created by Pavel on 17.01.2017.
 */
import {Injectable} from "@angular/core";
import {HttpService} from "../http/http.service";
import {Observable} from "rxjs/Observable";
import {SessionStorageService} from "ng2-webstorage";
import {Subscription} from "rxjs/Subscription";
import { Response, Headers } from "@angular/http";
import {XmlSchemaListTypes} from "../../modules/controls/xml.tree/types";

/**
 * XML service
 */
@Injectable()
export class XMLService {

    constructor(private httpService: HttpService,
                private sessionStorage: SessionStorageService) {

    }

    getXmlData(id): Observable<Subscription> {
        let key = 'xmlschema.' + id;
        let data = this.sessionStorage.retrieve(key);
        return Observable.create((observer) => {
            if (!data) {
                this.httpService
                    .get(
                        '/api/xml-schema/' + id
                    )
                    .map((res) => {
                        return res.json();
                    })
                    .subscribe(
                        (res) => {
                            this.sessionStorage.store(key, res);
                            observer.next(res);
                        },
                        (err) => {
                            observer.error(err);
                        });
            } else {
                observer.next(data);
            }
        });
    }

    getXmlDocument(id) {
        return this.httpService
            .get(
                '/api/xmldocument/' + id
            )
            .map((res) => {
                return res.json();
            });
    }

    getXmlForMetadata(itemId, type) {
        return this.httpService
            .get(
                '/api/metadata/' + type + "/" + itemId
            )
            .map((res) => {
                return res.json();
            })
    }

    getSampleXmlData() {
        return this.httpService
            .get(
                //'/api/ums/service/config/new/8e1d18d6-a01e-4b4a-95ff-9f5c21db6ec7/eac3eae7-a1c0-4726-8e8b-893e2e273aa8'
                //'/api/xml-schema/1280'
                '/api/xml-schema/4'
            )
            .map((res) => {
                return res.json();
            });
    }

    getSchemaList(): Observable<XmlSchemaListTypes> {
        let key = 'xmlschemas.all';
        let data = this.sessionStorage.retrieve(key);
        return Observable.create((observer) => {
            if (!data) {
                this.httpService
                    .get(
                        '/api/xml-schemas/'
                    )
                    .map((res) => {
                        return res.json();
                    })
                    .subscribe(
                        (res) => {
                            this.sessionStorage.store(key, res);
                            observer.next(res);
                        },
                        (err) => {
                            observer.error(err);
                        });
            } else {
                observer.next(data);
            }
        });
    }
    saveXmlDocument(xmlDocAndSchema, id = null): Observable<Response> {
      let headers = new Headers({'Content-Type': 'application/json'});
        var cache = [];
      return this.httpService
        .post(
          '/api/xmldocument/' + (id == null ? "0": id),
          JSON.stringify(xmlDocAndSchema, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Duplicate reference found
                    try {
                        // If this value does not reference a parent it can be deduped
                        return JSON.parse(JSON.stringify(value));
                    } catch (error) {
                        // discard key if value cannot be deduped
                        return;
                    }
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }),
          {headers: headers}
        )
        .map((res) => {
          return res.json();
        });
    }
}

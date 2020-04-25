/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {Inject, Injectable} from "@angular/core";
import {HttpService} from "../../../../services/http/http.service";
import {Observable} from "rxjs";
import {Headers, Response} from "@angular/http";
import {ViewSaveResp, ViewsOriginalType, ViewType} from "../types";
import {SessionStorageService} from "ng2-webstorage";
import {ReturnRequestStateType} from "../../../../views/base/types";

/**
 * Interface for views search
 */
export interface ViewsServiceInterface {
    // httpService: HttpService;
    //
    // /**
    //  *
    //  * @param viewType
    //  */
    // getViews(viewType: string): Observable<Response>;
    //
    // /**
    //  *
    //  * @param viewType
    //  * @param id
    //  */
    // getView(viewType: string, id: string): Observable<Response>;
    //
    // /**
    //  * @param view
    //  * @returns {Observable<R>}
    //  */
    // setAsDefaultView(o: any): Observable<Response>;
    //
    // /**
    //  * @param view for deleting
    //  * @returns {Observable<R>}
    //  */
    // deleteView(o: any): Observable<Response>;
    // /**
    //  * @param view
    //  * @returns {Observable<R>}
    //  */
    // saveView(o: any): Observable<Response>;
}

/**
 * Views search service
 */
@Injectable()
export class ViewsService {
    httpService;
    private storageKey: string = 'grid.views';

    constructor(@Inject(HttpService) _httpService: HttpService,
                private sessionStorage: SessionStorageService) {
        this.httpService = _httpService;
    }


    /**
     * Get view by type and Id
     * @param {string} viewType
     * @param {number} id
     * @returns {Observable<ViewType>}
     */
    loadViewById(viewType: string, id: number): Observable<ViewType> {
        return Observable.create((observer) => {
                this.getView(viewType, id).subscribe(
                    (resp) => {
                        observer.next(resp);
                    },
                    (error) => {
                        observer.error(error);
                    });
            }
        );
    }

    /**
     *
     * @param viewType
     * @returns {Observable<R>}
     */
    getViews(viewType: string): Observable<ViewsOriginalType> {
        let lang = localStorage.getItem("tmd.base.settings.lang");
        if (lang) {
            lang = lang.replace(/\"/g, "");
        }
        let key = this.storageKey + '.' + viewType + '.' + lang;
        let data: ViewsOriginalType = this.sessionStorage.retrieve(key);

        return Observable.create((observer) => {
                if (!data) {
                    this.httpService
                        .get(
                            '/api/view/info/' + viewType + '?lang=' + lang
                        )
                        .map((resp) => {
                            return resp.json();
                        })
                        .subscribe((res: ViewsOriginalType) => {
                            this.sessionStorage.store(key, res);
                            observer.next(res);
                        })

                } else {
                    observer.next(data);
                }
            }
        );
    }

    /**
     *
     * @param viewType
     * @param id
     * @returns {Observable<R>}
     */
    getView(viewType: string, id: number): Observable<ViewType> {
        let key = this.storageKey + '.' + viewType + '.' + id;
        let data: ViewType = this.sessionStorage.retrieve(key);
        return Observable.create((observer) => {
            if (!data) {
                return this.httpService
                    .get(
                        '/api/view/' + viewType + '/' + id
                    )
                    .map((res) => {
                        return res.json();
                    })
                    .subscribe((view: ViewType) => {
                        this.saveViewToStorage(view);
                        observer.next(view);
                    });
            } else {
                observer.next(data);
            }
        })
    }

    /**
     *
     * @param {ViewType} view
     * @returns {Observable<ViewSaveResp>}
     */
    setAsDefaultView(view: ViewType): Observable<ViewSaveResp> {
        return this.saveView(view, true);
    };


    deleteView(view: ViewType): Observable<ReturnRequestStateType> {
        let headers = new Headers({'Content-Type': 'application/json'});
        return Observable.create((observer) => {
            this.httpService
                .remove(
                    '/api/view/' + (view.Id || 0),
                    {headers: headers}
                )
                .map((resp) => {
                    return resp.json();
                })
                .subscribe((resp) => {
                    this.deleteViewFromStorage(view.Id, view.Type);
                    this.clearOriginalView(view.Type)
                    observer.next(resp);
                });
        });
    }

    /**
     *
     * @param {ViewType} view
     * @param {boolean} isDefault
     * @returns {Observable<ViewSaveResp>}
     */
    saveView(view: ViewType, isDefault: boolean = false): Observable<ViewSaveResp> {
        if (!view.Id && view.Id != 0) {
            view.Id = 0;
        }
        let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
        if(view.Id && view.Id > 0){
            this.deleteViewFromStorage(view.Id, view.Type);
        }

        this.clearOriginalView(view.Type);
        let url = isDefault?'/api/view/' + view.Type + '/' + view.Id + '/setdefault':'/api/view';

        return Observable.create((observer) => {
            this.httpService
                .post(
                    url,
                    JSON.stringify(view),
                    {headers: headers}
                )
                .map((resp) => {
                    return resp.json();
                })
                .subscribe((resp: ViewSaveResp) => {
                    this.saveViewToStorage(view);
                    observer.next(resp);
                });
        });
    }

    public deleteViewFromStorage(id: number, viewType: string) {
        let key = this.storageKey + '.' + viewType + '.' + id;
        this.sessionStorage.clear(key);
    }

    private saveViewToStorage(view: ViewType) {
        let key = this.storageKey + '.' + view.Type + '.' + view.Id;
        this.sessionStorage.store(key, view);
    }

    public clearOriginalView(viewType: string, lang: string = null) {
        if(lang === null){
            lang = localStorage.getItem("tmd.base.settings.lang");
        }
        lang = lang.replace(/\"/g, "");
        let key = this.storageKey + '.' + viewType + '.' + lang;
        this.sessionStorage.clear(key);
    }

    // private clearCache(viewType: string,){
    //     this.clearOriginalView(viewType)
    // }
}

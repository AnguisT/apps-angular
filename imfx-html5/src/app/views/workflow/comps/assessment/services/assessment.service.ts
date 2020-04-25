import {Injectable} from "@angular/core";
import {Observable, Subscription, } from "rxjs";
import {Response, Headers} from "@angular/http";
import {SessionStorageService} from 'ng2-webstorage';
import {HttpService} from "../../../../../services/http/http.service";
import {MediaDetailDetailsViewResponse} from "../../../../../models/media/detail/detailsview/media.detail.detailsview.response";
import {MediaDetailMediaCaptionsResponse} from "../../../../../models/media/detail/caption/media.detail.media.captions.response";
import {MediaDetailPacSubtitlesResponse} from "../../../../../models/media/detail/pacsubtitles/media.detail.pac.subtitiles.response";

export interface AssessmentServiceInterface {
    httpService;
    sessionStorage;

    getDetail(id): Observable<Response>;
    getLookups(id): Observable<Response>;
    getDetails(id, subtypes, typeDetails, detailsviewType): Observable<any>;
    getDetailsAsync(id, subtype, typeDetails, detailsviewType): any;
    getVideoInfo(id: number, typeDetails: String, options: {
        smudge: boolean,
        scene?: boolean,
        waveform?: boolean
    }): any;

    checkFields(file);

    getDetailMediaTagging(id);
    getDetailsView(subtype, detailsviewType): Observable<MediaDetailDetailsViewResponse>;
    getSubtitles(id: number): Observable<Array<MediaDetailMediaCaptionsResponse>>;
  getPacSubtitles(id: number): Observable<Array<MediaDetailPacSubtitlesResponse>>;
}

@Injectable()
export class AssessmentService implements AssessmentServiceInterface {
    constructor(public httpService: HttpService,
              public sessionStorage: SessionStorageService) {
    }
    /**
    * Get detail info by id
    * @param r_params route params with ID
    */
    getDetail(id): Observable<Response> {
        return this.httpService
            .get(
                '/api/v3/task/assess/' + id
            )
            .map((res) => {
                return res.json();
            });
    };


    getDetails(id, subtypes, typeDetails, detailsviewType)  {
        var lang = localStorage.getItem('tmd.base.settings.lang');
        if(lang) {
          lang = lang.replace(/\"/g,'');
        }
        return this.httpService.get('/api/v3/task/assess/' + id)
            .map(res => res.json())
            .mergeMap(resp =>
                      this.httpService.get('/api/detailsview/' + detailsviewType + '/0' /* + (subtypes[resp.MEDIA_TYPE]||subtypes[0])*/ + '?lang=' + lang)
                        .map(
                            res1 => res1.json()
                        ),
                        (res, res1) =>{
                            this.checkFields(res);
                            return [res, res1];
                        }
                    )
    };

    getDetailsAsync(id, subtype, typeDetails, detailsviewType) {
        var lang = localStorage.getItem("tmd.base.settings.lang");
        if(lang) {
          lang = lang.replace(/\"/g,"");
        }
        return Observable.forkJoin(
            this.httpService
                .get('/api/' + typeDetails + '/'+id)
                .map((res) => { return res.json(); }),
            this.httpService
                .get('/api/detailsview/'+ detailsviewType + '/' + subtype + '?lang=' + lang)
                .map((res) => {return res.json();})
            )
    };

    checkFields(file){
        if(!file.TITLE && file.LI_TTL_text){
            file.TITLE = file.LI_TTL_text;
        }
    };
    getDetailMediaTagging(id){
        return this.httpService.get('/api/media-tagging/'+id)
                    .map((res) => {
                        return res.json();
                    });
    };

    /**
    * Get friendly names from storage (if not -> load&save)
    */
    getLookups(id:string): Observable<Response> {
        let data = this.sessionStorage.retrieve(id);
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
                            this.sessionStorage.store(id, d);
                            observer.next(d);
                        },
                        (err) => {
                            observer.error(err);
                    });
            } else {
                observer.next(data);
            }
        });
    };
    /**
    * Get video info
    */
    getVideoInfo(id: number, typeDetails: String, options: {
        smudge: boolean,
        scene?: boolean,
        waveform?: boolean
    }) {
        let params = [];
        for (var i in options) {
            if (options[i]) {
                params.push(i)
            }
        }

        return this.httpService.get('/api/mediavideo/'+id+'?info='+params.join(",")).map((res) => {
            let response = res.json();
            if (response.Smudge) {
                response.Smudge.Url = this.httpService.getBaseUrl() + response.Smudge.Url;
            }
            if (response.Scene) {
                response.Scene.Url = this.httpService.getBaseUrl() + response.Scene.Url;
            }
            if (response.AudioWaveform) {
                response.AudioWaveform.Url = this.httpService.getBaseUrl() + response.AudioWaveform.Url;
            }
            return response;
        });
    }
    getDetailsView(subtype, detailsviewType): Observable<MediaDetailDetailsViewResponse> {
      let lang = localStorage.getItem('tmd.base.settings.lang');
      if (lang) {
        lang = lang.replace(/\"/g, '');
      }
      return this.httpService
        .get('/api/detailsview/' + detailsviewType + '/' + 5 + '?lang=' + lang)
        .map((res) => {
          return res.json();
        });
    };
    getSubtitles(id: number): Observable<Array<MediaDetailMediaCaptionsResponse>> {
      return this.httpService.get('/api/media-captions/' + id).map((res) => {
        let response = res.json();
        return response;
      });
    }

  getPacSubtitles(id: number): Observable<Array<MediaDetailPacSubtitlesResponse>> {
    return this.httpService.get('/api/v3/subtitles/' + id).map((res) => {
      let response = res.json();
      return response;
    });
  };
    save(id: number, options: any): Observable<Response> {
        let headers = new Headers({'Content-Type': 'application/json'});
                return this.httpService
                .post(
                '/api/v3/task/assess/',
                JSON.stringify(options),
            {headers: headers}
        )
        .map((res) => {
            return res.json();
        });
    }
}

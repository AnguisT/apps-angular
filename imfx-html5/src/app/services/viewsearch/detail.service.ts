/**
 * Created by initr on 31.10.2016.
 */
import {Injectable} from '@angular/core';
import {HttpService} from '../http/http.service';
import {Observable} from "rxjs/Rx";
import {Response} from "@angular/http";
import {ActivatedRoute} from '@angular/router';

/**
 * Detail service
 */

@Injectable()
export class DetailData {
    constructor(private httpService: HttpService, private route: ActivatedRoute ){
      }

    /**
     * Search by id
     * @param id - id
     * @returns {Observable<R>}
     */
    search(id: any, typeDetails): Observable<Response> {
        return this.httpService
            .get(
                '/api/' + typeDetails + '/'+id
            )
            .map((res) => {
                return res.json();
            });
    }
    getDetailsView(subtype, detailsviewType): Observable<Response> {
        var lang = localStorage.getItem("tmd.base.settings.lang");
        if(lang) {
          lang = lang.replace(/\"/g,"");
        }
        return this.httpService
                .get('/api/detailsview/'+ detailsviewType + '/' + subtype + '?lang=' + lang)
                .map((res) => {
                    return res.json();
                });
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
    getDetails(id, subtypes, typeDetails, detailsviewType)  {
        var lang = localStorage.getItem("tmd.base.settings.lang");
        if(lang) {
          lang = lang.replace(/\"/g,"");
        }
        return this.httpService.get('/api/' + typeDetails + '/'+id)
            .map(res => res.json())
            .mergeMap(resp =>
                      this.httpService.get('/api/detailsview/'+ detailsviewType + '/' + (subtypes[resp.MEDIA_TYPE]||subtypes[0]) + '?lang=' + lang)
                        .map(
                            res1 => res1.json()
                        ),
                        (res, res1) =>{
                            this.checkFields(res);
                            return [res, res1];
                        }
                    )
    };
    getVideoDetails(id, typeDetails) {
      // return this.httpService.get('/api/file/'+id+'/meida')
      return this.httpService.get('/api/' + typeDetails + '/'+id)
        //.map(res => res.json())
    };

    checkFields(file){
        if(!file.TITLE && file.LI_TTL_text){
            file.TITLE = file.LI_TTL_text;
        }
    }
    getDetailHistory(type, id){
        return this.httpService.get('/api/history/' + type + '/'+id)
                    .map((res) => {
                        return res.json();
                    });
    }

    getVideoInfo(id: number, options?: {
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
        return response
      });
    }

    getDetailMediaTagging(id){
        return this.httpService.get('/api/media-tagging/'+id)
                    .map((res) => {
                        return res.json();
                    });
    }
}

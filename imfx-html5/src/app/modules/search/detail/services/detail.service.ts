/**
 * Created by Sergey Klimenko on 10.03.2017.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, Response } from '@angular/http';
import { HttpService } from '../../../../services/http/http.service';
import { SessionStorageService } from 'ng2-webstorage';
import { Select2ListTypes } from '../../../controls/select2/types';
import { MediaDetailResponse } from '../../../../models/media/detail/media.detail.response';
import {
    MediaDetailDetailsViewResponse
} from '../../../../models/media/detail/detailsview/media.detail.detailsview.response';
import {
    MediaDetailMediaVideoResponse
} from '../../../../models/media/detail/mediavideo/media.detail.mediavideo.response';
import {
    MediaDetailMediaCaptionsResponse
} from '../../../../models/media/detail/caption/media.detail.media.captions.response';
import {
    MediaDetailMediaTaggingResponse
} from '../../../../models/media/detail/mediatagging/media.detail.media.tagging.response';
import {
    MediaDetailHistoryResponse
} from '../../../../models/media/detail/history/media.detail.detail.history.response';
import {
    MediaDetailPacSubtitlesResponse
} from '../../../../models/media/detail/pacsubtitles/media.detail.pac.subtitiles.response';
import {
    MediaDetailReportsResponse
} from '../../../../models/media/detail/reports/media.detail.reports.response';
import {MediaDetailAttachmentsResponse} from "../../../../models/media/detail/attachments/media.detail.detail.attachments.response";

/*
 * Search modal
 */
export interface DetailServiceInterface {
    httpService;
    //  detailData;
    sessionStorage;

    getDetail(r_params, typeDetails): Observable<Response>; // Not used
    getLookups(id): Observable<Response>;
    getDetails(
        id,
        subtypes,
        typeDetails,
        detailsviewType
    ): Observable<(MediaDetailResponse | MediaDetailDetailsViewResponse)[]>;
    getSimplifiedDetails(id): Observable<MediaDetailResponse>;
    getSubtitles(id: number): Observable<Array<MediaDetailMediaCaptionsResponse>>;
    getPacSubtitles(id: number): Observable<Array<MediaDetailPacSubtitlesResponse>>;
    getDetailsView(subtype, detailsviewType): Observable<MediaDetailDetailsViewResponse>;
    getDetailsAsync(
        id,
        subtype,
        typeDetails,
        detailsviewType
    ): Observable<[MediaDetailResponse, MediaDetailDetailsViewResponse]>;
    getVideoInfo(id: number, options?: {
        smudge: boolean,
        scene?: boolean,
        waveform?: boolean
    }): Observable<MediaDetailMediaVideoResponse>;
    // getTaxonomy(): Observable<Response>; // Moved to TaxonomyService
    saveMediaTagging(options, id): Observable<Response>;
    getMediaSmudges(ids: Array<number>): Observable<any>;

    checkFields(file);
    getDetailHistory(type, id): Observable<Array<MediaDetailHistoryResponse>>;
    getDetailMediaTagging(id): Observable<MediaDetailMediaTaggingResponse>;

    getDetailReport(id: number): Observable<Array<MediaDetailReportsResponse>>;
    getMediaTaggingAsync(o): Observable<[
        (MediaDetailResponse | MediaDetailDetailsViewResponse)[],
        MediaDetailMediaTaggingResponse
    ]>;
    getDetailAttachments(type, id): Observable<Array<MediaDetailAttachmentsResponse>>;
    getIMFPackage(id): Observable<any>;
    getIMFCPL(id): Observable<any>;
    save(id: number, options: any): Observable<Response>
}
/**
 * Search Modal service
 */
@Injectable()
export class DetailService implements DetailServiceInterface {
    constructor(public httpService: HttpService,
                // public detailData: DetailData,
                public sessionStorage: SessionStorageService) {
    }

    /**
     * Get detail info by id
     * @param r_params route params with ID
     */
    getDetail(r_params, typeDetails): Observable<Response> {
        return this.httpService
            .get(
                '/api/' + typeDetails + '/' + r_params
            )
            .map((res) => {
                return res.json();
            });
    };


    getDetails(
        id,
        subtypes,
        typeDetails,
        detailsviewType
    ): Observable<(MediaDetailResponse | MediaDetailDetailsViewResponse)[]> {
        let lang = localStorage.getItem('tmd.base.settings.lang');
        if (lang) {
            lang = lang.replace(/\"/g, '');
        }
        return this.httpService.get('/api/' + typeDetails + '/' + id)
            .map((res) => res.json())
            .mergeMap(resp =>
                    this.httpService.get('/api/detailsview/' + detailsviewType + '/' +
                    (subtypes[resp && resp.MEDIA_TYPE ? resp.MEDIA_TYPE : 0]) + '?lang=' + lang)
                        .map(
                            res1 => res1.json()
                        ),
                (res, res1) => {
                    this.checkFields(res);
                    return [res, res1];
                }
            );
    };

    getSimplifiedDetails(id): Observable<MediaDetailResponse> {
        return this.httpService.get('/api/media-details/' + id)
        // return this.httpService.get('/api/file/' + id + '/media')
            .map(res => res.json());
    }

    getDetailsView(subtype, detailsviewType): Observable<MediaDetailDetailsViewResponse> {
        let lang = localStorage.getItem('tmd.base.settings.lang');
        if (lang) {
            lang = lang.replace(/\"/g, '');
        }
        return this.httpService
            .get('/api/detailsview/' + detailsviewType + '/' + subtype + '?lang=' + lang)
            .map((res) => {
                return res.json();
            });
    };

    getDetailsAsync(id, subtype, typeDetails, detailsviewType):
    Observable<[MediaDetailResponse, MediaDetailDetailsViewResponse]> {
        let lang = localStorage.getItem('tmd.base.settings.lang');
        if (lang) {
            lang = lang.replace(/\"/g, '');
        }
        return Observable.forkJoin(
            this.httpService
                .get('/api/' + typeDetails + '/' + id)
                .map((res) => {
                    return res.json();
                }),
            this.httpService
                .get('/api/detailsview/' + detailsviewType + '/' + subtype + '?lang=' + lang)
                .map((res) => {
                    return res.json();
                })
        );
    };

    /**
     * Call for loading media logger
     * @param o
     * @returns {Observable<[any , any]>}
     */

    getMediaTaggingAsync(o): Observable<[
        (MediaDetailResponse | MediaDetailDetailsViewResponse)[],
        MediaDetailMediaTaggingResponse
    ]> {
        let lang = localStorage.getItem('tmd.base.settings.lang');
        if (lang) {
            lang = lang.replace(/\"/g, '');
        }
        return Observable.forkJoin(
            // request for file detail info
            this.httpService.get('/api/' + o.typeDetails + '/' + o.id)
                .map((res) => res.json())
                .mergeMap(resp =>
                        this.httpService.get(
                            '/api/detailsview/' + o.detailsviewType + '/' +
                            (o.subtypes[resp.MEDIA_TYPE] || o.subtypes[0]) + '?lang=' + lang)
                            .map(
                                res1 => res1.json()
                            ),
                    (res, res1) => {
                        this.checkFields(res);
                        return [res, res1];
                    }
                ),
            // requet for media tagging
            this.httpService.get('/api/media-tagging/' + o.id)
                .map((res) => {
                    return res.json();
                })
        );
    }

    checkFields(file) {
        if (file) {
            if (!file.TITLE && file.LI_TTL_text) {
                file.TITLE = file.LI_TTL_text;
            }
        }
    };

    getDetailHistory(type, id): Observable<Array<MediaDetailHistoryResponse>> {
        return this.httpService.get('/api/history/' + type + '/' + id)
            .map((res) => {
                return res.json();
            });
    };

    getDetailMediaTagging(id): Observable<MediaDetailMediaTaggingResponse> {
        return this.httpService.get('/api/media-tagging/' + id)
            .map((res) => {
                return res.json();
            });
    };

    /**
     * Get friendly names from storage (if not -> load&save)
     */
    getLookups(id: string): Observable<Response> {
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
    getVideoInfo(id: number, options?: {
        smudge: boolean,
        scene?: boolean,
        waveform?: boolean
    }): Observable<MediaDetailMediaVideoResponse> {
        let params = [];
        for (let i in options) {
            if (options[i]) {
                params.push(i);
            }
        }

        let paramsstr = params.join(',');

        return this.httpService.get(
            '/api/mediavideo/' + id + (paramsstr ? '?info=' + params.join(',') : ''))
            .map((res) => {
                let response = res.json();
                if (response.Smudge) {
                    response.Smudge.Url = this.httpService.getBaseUrl() + response.Smudge.Url;
                }
                if (response.Scene) {
                    response.Scene.Url = this.httpService.getBaseUrl() + response.Scene.Url;
                }
                if (response.AudioWaveform) {
                    response.AudioWaveform.Url = this.httpService.getBaseUrl() +
                    response.AudioWaveform.Url;
                }
                return response;
            });
    }

    /**
     * Get smduges
     */
    getMediaSmudges(ids: Array<number>) {
        return this.httpService.get('/api/v3/media-smudge/' + ids.join(',')).map((res) => {
            let response = res.json();
            for (let i in response) {
                response[i].Url = this.httpService.getBaseUrl() + response[i].Url;
            }
            let results = []
            for (let id of ids) {
                if (response[id]) {
                    response[id].MediaId = id;
                    results.push(response[id]);
                }
            }
            return results;
        });
    }

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

    getDetailReport(id: number): Observable<Array<MediaDetailReportsResponse>> {
        return this.httpService.get('/api/v3/media-reports/' + id)
      //  return this.httpService.get('/getfile.aspx?id=3006017')
            .map((res) => {
                return res.json();
            });
    }

    saveMediaTagging(options, id): Observable<Response> {
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.httpService
            .post(
                '/api/media-tagging/save/' + id,
                JSON.stringify(options),
                {headers: headers}
            )
            .map((res) => {
                return res.json();
            });
    }

    getDetailAttachments(type, id): Observable<Array<MediaDetailAttachmentsResponse>> {
      return this.httpService.get('/api/v3/attachments/' + type + '/' + id)
        .map((res) => {
          return res.json();
        });
    };
    getIMFPackage(id): Observable<any> {
      return this.httpService.get('/api/v3/imf/' + id)
        .map((res) => {
          return res.json();
        });
    };
    getIMFCPL(id): Observable<any> {
      return this.httpService.get('/api/v3/imf/cpl/' + id)
        .map((res) => {
          return res.json();
        });
    };
    save(id: number, options: any): Observable<Response> {
        return;
    }
}

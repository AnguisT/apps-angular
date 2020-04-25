import {Inject, Injectable} from '@angular/core';
import {AccordionService} from '../../../../../modules/accordion/services/accordion.service';
import {HttpService} from '../../../../../services/http/http.service';

@Injectable()
export class MisrAccordionService extends AccordionService {
    constructor(@Inject(HttpService) httpService: HttpService) {
        super(httpService);
    }
    /*getMediaData(id:string): void {
        return this.httpService
          .get(
            '/api/misr/' + id + '/media'
          )
          .map((resp) => {
            return resp.json();
          });
    }

    getChartData(params) {
        var searchStr = '';
        var amp = '';
        var search = '';
        if(params) {
          if(params.channel || params.form){
            search = '?';
          }
          if(params.channel && params.form){
            amp = '&';
          }
            searchStr = "" + search + (params.channel ?'channel='+ params.channel : '') + amp + (params.form ? 'form=' + params.form : '');// + '&_='+new Date().getTime();
        }
        console.log(searchStr);
        return this.httpService
          .get(
            '/api/misr/chart' + searchStr
          )
          .map((resp) => {
            return resp.json();
          });
    }*/
}

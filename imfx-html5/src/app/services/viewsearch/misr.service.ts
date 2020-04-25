/**
 * Created by Sergey Klimenko on 15.03.2017.
 */
import {Injectable} from '@angular/core';
import {HttpService} from '../http/http.service';

/**
 * Misr service
 */

@Injectable()
export class MisrSearchService {

  constructor(public httpService: HttpService) {
  }

  getMediaData(id:string) {
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
  }
}

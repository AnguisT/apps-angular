/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {Inject, Injectable} from '@angular/core';
import {GridService} from '../../../modules/search/grid/services/grid.service';
import {HttpService} from '../../../services/http/http.service';

@Injectable()
export class CarrierGridService extends GridService {
    constructor(@Inject(HttpService) httpService: HttpService) {
        super(httpService);
    }
}

/**
 * Created by initr on 17.01.2017
 */
import {Injectable, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {Response} from '@angular/http';
import * as $ from 'jquery';

@Injectable()
export class SplashService {
    /**
     * State of loader (enabled or disabled)
     * @type {boolean}
     */
    private state: boolean = true;

    public toggleLoader = new EventEmitter();

    // constructor() { }
    public documentReady(): Observable<Response> {
        let self = this;
        return Observable.create((observer) => {
                $(document).ready(function(){
                    setTimeout(()=>{
                        self.toggleLoader.emit(self.state);
                    });
                });
            }
        );
    }

    /**
     * Enable loader
     */
    public enableLoader(): void {
        this.state = true;
        this.toggleLoader.emit(this.state);
    }

    /**
     * Disable loader
     */
    public disableLoader(): void {
        this.state = false;
        this.toggleLoader.emit(this.state);
    }
}

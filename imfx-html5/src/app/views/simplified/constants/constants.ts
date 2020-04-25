import {Injectable} from '@angular/core';

@Injectable()
export class AppSettings {
    private contributorThumb = './assets/img/contributor.jpg';

    constructor(){ 
    }
    public getContributorThumb(){
        return this.contributorThumb;
    }
}
/**
 * Created by Sergey Trizna on 21.03.2018.
 */
import { ElementRef, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
export type SplitItemSizeSetup = { enabled: boolean, size: number }
export type SplitSizesFromEvent = {gutterNum: number, sizes: number[]};
@Injectable()
export class SplitProvider {
    localStorageName = 'angular-imfx-split-state';
    private config = {};
    private isFirstInit: boolean = true;
    private path: string;
    private areasTemplate = {
            visible:{isFirstInit: true},
            size:{isFirstInit: true}
    };

    public resetToNavStart(){
        this.config = {};
        this.isFirstInit = true;
        this.path = '';
    }


    private initSizesFromLS() {
        if (localStorage.getItem(this.localStorageName)) {
            this.config = JSON.parse(localStorage.getItem(this.localStorageName));
        }
        else {
            this.resetConfig();
        }

        // for detail page
        this.path = window.location.hash;
        if (this.path.indexOf('detail/') != -1){
            this.path.substr(0, this.path.indexOf('detail/')) + 'detail/';
        }

        let currConfig;

        if (!this.config[this.path]) {
            currConfig = [];
            this.config[this.path] = currConfig;
        } else{
            currConfig = this.config[this.path];
        }


        //to load data from localStorage if it is first loading
        currConfig.forEach((el,i)=>{
          el = el.map((subEl, i, arr) => {
                for (let key in subEl) {
                    subEl[key].isFirstInit = true;
                }
                return subEl;
            });
        });
    }





    private resetConfig() {
        this.config = {};
        localStorage.removeItem(this.localStorageName);
    }

    private saveLocalStorage() {
        localStorage.setItem(this.localStorageName, JSON.stringify(this.config));
    }

    public getFlexSize (notInclude: number[]): number {
        let notIncludeSize = 100;
        let currConfigAreas = this.config[this.path][notInclude[0]];

        if (!currConfigAreas[notInclude[1]]){
            currConfigAreas[notInclude[1]] = $.extend(true, {}, this.areasTemplate);
        }

        currConfigAreas.forEach((el,i,arr)=>{
            if ((el.visible['value']) && (i != notInclude[1])) {
                notIncludeSize -= el.size['value'];
            }
        });

        currConfigAreas[notInclude[1]].size['value'] = notIncludeSize;
        currConfigAreas[notInclude[1]].visible['value'] = true;
        return notIncludeSize;
    }
    // toDo union similar actions for getAreaSize & getAreaVisible
    private prepareData(order:number[]){
        if (this.isFirstInit){
            this.initSizesFromLS();
            this.isFirstInit = false;
        }

        if(typeof this.config[this.path][order[0]] == 'undefined'){
            this.config[this.path][order[0]] = [];
        }

        let currConfigAreases = this.config[this.path][order[0]];

        if (!currConfigAreases[order[1]]){
            currConfigAreases[order[1]] = $.extend(true, {}, this.areasTemplate);
        }

        return currConfigAreases[order[1]];
    }

    public getAreaSize(order: number[], defaultValue:number): number{
        let currConfigAreas = this.prepareData(order);

        if (typeof currConfigAreas.size['value'] == "undefined"){
            currConfigAreas.size['value'] = defaultValue;
        }
        if (currConfigAreas.size['isFirstInit']){
            //lock for change to save state loaded from localSlorage
            setTimeout(()=>{
                currConfigAreas.size['isFirstInit'] = false;
            }, 2000);
        }

        return currConfigAreas.size['value'];
    }

    public getAreaVisible(order: number[], value: boolean, defaultValue:boolean): boolean{
        let currConfigAreas = this.prepareData(order);

        // toDo with null
        if (typeof currConfigAreas.visible['value'] == "undefined"){
            currConfigAreas.visible['value'] = defaultValue;
        }
        if (currConfigAreas.visible['isFirstInit']){
            //lock for change to save state loaded from localSlorage
            setTimeout(()=>{
                currConfigAreas.visible['isFirstInit'] = false;
            }, 2000);
        } else{
            // save changes if state was changed
            if (currConfigAreas.visible['value'] != value){
                currConfigAreas.visible['value'] = value;
                this.saveLocalStorage();
            }
        }

        return currConfigAreas.visible['value'];
    }


    public saveSizes(index: number, event: SplitSizesFromEvent): void {
        let currConfigAreas = this.config[this.path][index];

        let counter = 0;
        currConfigAreas.forEach((el)=>{
            if (el.visible['value'] || el.visible['isFirstInit']) {
                el.size['value'] = event.sizes[counter];
                counter++;
            }
        });
        this.saveLocalStorage();
        // debugger
    }


}

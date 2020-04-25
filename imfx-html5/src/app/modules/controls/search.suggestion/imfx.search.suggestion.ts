import {Component, Input, Output, ElementRef, EventEmitter, ChangeDetectorRef, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/Rx';
//
@Component({
    selector: 'search-suggestion',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    host: {
        '(document:click)': 'onClick($event)',
    },
    encapsulation: ViewEncapsulation.None
})
/**
 *
 *
 */
export class IMFXSearchSuggestionComponent {
    @Input() searchService;
    @Input() appSettings;
    @Input() outsideCriteria;
    @Input() outsideSearchString;
    @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedFilters: EventEmitter<any> = new EventEmitter<any>();

    private searchString: string;
    private searching: boolean = false;
    private enabledSearchButton: boolean = false;
    private showAutocompleteDropdown: boolean = false;
    private results = {
                titles: [],
                series: [],
                contributors: []
            };
    private searchCriteria = {};
    private currentMode:string = 'Titles';
    private arraysOfResults = ['titles', 'series', 'contributors'];
    private currentItem:number = -1;
    private currentArray:number = 0;
    constructor( private cdr: ChangeDetectorRef, private elementRef: ElementRef) {
        // delay for Suggestion
        Observable.fromEvent(elementRef.nativeElement, 'keyup')
        .debounceTime(1000)
        .subscribe(kEvent => {
            if(!(kEvent['which'] == 13 || kEvent['which'] == 40 || kEvent['which'] == 38|| kEvent['which'] == 37 || kEvent['which'] == 39|| kEvent['which'] == 27)){ //not arrows or enter, or esc

                this.onSearchSuggestion(this.searchString);
            }
        });
    };
    ngOnChanges() {
        if(this.outsideCriteria) {
            this.selectResult(this.outsideCriteria);
            this.cdr.detectChanges();
        }
        if(this.outsideSearchString) {
            this.searchString = this.outsideSearchString;
            this.cdr.detectChanges();
        }
    };
    doSearch(){
        this.searchString = this.searchString.trim();
        this.currentItem = -1;
        this.currentArray = 0;
        this.currentMode = 'Titles';
        this.searching = true;
        this.selectedFilters.emit({searchCriteria: {},
                                    searchString: this.searchString });
    };
    onKeyUp($event): void {
        this.searchString = $event.target.value;
        if($event.which) {
            if($event.target.value.trim().length) {
                // this.enabledSearchButton = true; // why ?
                this.searchString = $event.target.value;//.trim();
            } else {
                // this.enabledSearchButton = false; // why ?
                this.searchString = "";
            }
        }
        if($event.currentTarget.localName == "button"){
            this.doSearch();
            return;
        }
        switch ($event.which){
            case 40:{  //arrow down
                if(!this.isLastElem(this.results[this.arraysOfResults[this.currentArray]], this.currentItem) || this.currentItem < 0){
                    this.currentItem++;
                }
                else if( this.currentArray < this.arraysOfResults.length-1 ){
                    this.currentItem = 0;
                    this.currentArray++;
                }
                break;
            }
            case 37:{  //arrow left
                this.currentItem = 0;
                if (this.currentArray == 0){
                    this.currentArray = this.arraysOfResults.length-1;
                }
                else {
                    this.currentArray--;
                }
                break;
            }
            case 38:{  //arrow up
                if( this.currentItem > 0){
                    this.currentItem--;
                }
                else if(this.currentArray > 0) {
                    this.currentArray--;
                    this.currentItem = this.results[this.arraysOfResults[this.currentArray]].length-1;
                }
                break;
            }
            case 39:{  //arrow right
                this.currentItem = 0;
                if( this.currentArray == this.arraysOfResults.length-1 ){ //if right group selected
                    this.currentArray = 0;
                }
                else {
                    this.currentArray++;
                }
                break;
            }
            case 27:{//esc button
                this.resetSuggestion();
                this.results = {
                    titles: [],
                    series: [],
                    contributors: []
                };
                break;
            }
            case 13:{//enter
                if (!this.showAutocompleteDropdown || this.currentItem<0) {
                    this.doSearch();
                    break;
                }
                $event.preventDefault;
                $event.stopPropagation();
                this.selectResult(this.results[this.arraysOfResults[this.currentArray]][this.currentItem]);
                break;
            }
            default: {
                this.currentItem = -1;
                this.currentArray = 0;
                this.currentMode = 'Titles';
                this.searching = true;
                this.cdr.reattach();
                break;
            }
        }
    };
    private isLastElem(arr, ind){
        return arr.length === ind+1;
    };

     /**
     * search Suggestion
     * @param data
     * @param isValid
     */
    onSearchSuggestion(data): void {
        if (this.currentItem >=0 || this.searchString.length < 3) {
            this.showAutocompleteDropdown = false;
            this.searching = false;
            // this.cdr.reattach();
            return;
        }
        this.showAutocompleteDropdown = true;
        this.results = {
                titles: [],
                series: [],
                contributors: []
            };
        this.currentItem = -1;
        this.currentArray = 0;
        this.searchService.searchSuggestion(this.searchString.trim()).subscribe(
            (res) =>
            {
                this.searchString = this.searchString.trim();
              for (var e in res) {
                for (var i = 0; i < res[e].length; i++) {
                  let elem = {
                    title: res[e][i].Title,
                    count: res[e][i].Count,
                    image: window.location.protocol.indexOf("https") == 0 ? res[e][i].ThumbUrl && res[e][i].ThumbUrl.replace("http://", "https://") : res[e][i].ThumbUrl,
                    type: e
                  };
                  switch (e) {
                    case 'Series': {
                      elem['id'] = res.Series[i].SeriesId
                      break;
                    }
                    case 'Contributors': {
                      elem['id'] = res.Contributors[i].ContributorId;
                      elem['image'] = elem.image || this.appSettings.getContributorThumb()
                      break;
                    }
                    default:
                      break;
                  }
                  this.results[e.toLocaleLowerCase()].push(elem);
                }
              }
              if(res.Contributors.length > 0 || res.Titles.length > 0 || res.Series.length > 0) {
                this.onSearch.emit(this.showAutocompleteDropdown);
              }
              this.searching = false;
              this.cdr.reattach();
            }
        );
    };
     /**
     *reset Suggestion params
     */
    private resetSuggestion(){
        this.showAutocompleteDropdown = false;
       this.onSearch.emit(this.showAutocompleteDropdown);
        this.currentItem = -1;
        this.currentArray = 0;
    };
     /**
     *send search request with search criteria
     *@param result
     */
    private selectResult(result){
        this.resetSuggestion();
        this.currentMode = result.type || 'Titles';
        this.searchString = result.title;
        if(result.type !== 'Titles'){
            this.searchCriteria = {
                fieldId: result.type == 'Series' ? 'SERIES_ID' : (result.type == 'Contributors' ? 'CONTRIBUTOR_ID': ''),
                value: result.id
            };
            this.selectedFilters.emit({searchCriteria: this.searchCriteria,
                                       searchString: this.searchString });
        }
        else {
            this.selectedFilters.emit({searchCriteria: {},
                                       searchString: this.searchString });
        }

    };
    private hoverRow(ind, arrInd){
        this.currentItem = ind;
        this.currentArray = arrInd;
    };
    /**
    * click outside
    */
    onClick(event) {
        if (!this.elementRef.nativeElement.contains(event.target)){
            this.resetSuggestion();
            this.results = {
                titles: [],
                series: [],
                contributors: []
            };
        }
    };
}

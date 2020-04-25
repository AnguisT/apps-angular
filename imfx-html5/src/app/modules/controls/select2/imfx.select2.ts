/**
 * Created by Sergey Trizna on 17.12.2016.
 */
// See https://select2.github.io
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectorRef
} from "@angular/core";
import {Router} from "@angular/router";

import {ArrayProvider} from "../../../providers/common/array.provider";
import {LangChangeEvent, TranslateService} from "ng2-translate";
// Loading jQuery
import * as $ from "jquery";
// Loading plugin
import "select2/dist/js/select2.js";
import "style-loader!select2/dist/css/select2.min.css";
import {Guid} from "../../../utils/imfx.guid";
import {StringProivder} from "../../../providers/common/string.provider";
import {Select2ConvertObject, Select2ItemType, Select2ListTypes} from "./types";


@Component({
    selector: 'imfx-controls-select2',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    // host: {
    //     '(window:hashchange)': 'close()'
    // },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        ArrayProvider
    ]
})

export class IMFXControlsSelect2Component {
    @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    @Output() onUnselect: EventEmitter<any> = new EventEmitter<any>();
    @Output() onAnyEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
    @Output() afterSearch: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Reference to current component
     */
    @ViewChild('imfxControlsSelect2') private compRef;

    /**
     * Data for plugin
     * @type {Array}
     */
    @Input('data') private data: Array<any> = [];

    /**
     * Selected ids of data objects
     * @type {Array}
     */
    @Input('selected') private selected: Array<any> = [];

    /**
     * Custom class for select2 wrapper
     * @type {String}
     */
        // TODO: FIX IT, CURRENTLY DOES NOT WORK
    @Input('wrapperClass') private wrapperClass: string = "";

    /**
     * Open on hover
     */
    @Input('openOnHover') private openOnHover: boolean = false;

    /**
     * First item is empty
     * @type {boolean}
     */
    @Input('firstEmpty') private firstEmpty: boolean = false;

    /**
     * Value of first empty item
     * @type {string}
     */
    // @Input('firstEmptyValue') private firstEmptyValue: string = '';

    /**
     * Label of first empty item
     * @type {string}
     */
    // @Input('firstEmptyLabel') private firstEmptyLabel: string = '--empty--';

    /**
     * Enabling/Disabling multiple attr
     */
    @Input('multiple') private multiple = false;

    /**
     * Enabling/disabling tag mode
     */
    @Input('tags') private tags = false;

    /**
     * Close dropdown on select
     * @type {boolean}
     */
    @Input('closeOnSelect') private closeOnSelect: boolean = true;

    /**
     * Token separator between tags
     */
    @Input('tokenSeparators') private tokenSeparators: [',', ' '];

    /**
     * Auto width for dropdown
     */
    @Input('dropdownAutoWidth') private dropdownAutoWidth: boolean = true;

    /**
     * Width for select box
     * @type {string}
     */
        // @Input('width') private width = '300px';
    @Input('width') private width;

    /**
     * Ajax options
     * See https://select2.github.io/examples.html#data-ajax and example in readme
     * @type {{}}
     */
    @Input('ajax') private ajax = null;

    /**
     * Enable/disable cache
     * @type {boolean}
     */
    @Input('cache') private cache: boolean = true;

    /**
     * External array of selected values
     * @type {array}
     */
    @Input('value') private value: Array<any>;

    /**
     * Minimum input length
     * @type {number}
     */
    @Input('minimumInputLength') private minimumInputLength: number = 0;

    /**
     * Maximum selection length
     * @type {number}
     */
    @Input('maximumSelectionLength') private maximumSelectionLength: number = Infinity;

    /**
     * Minimum results for search
     * @type {number}
     */
    @Input('minimumResultsForSearch') private minimumResultsForSearch: number = 0;

    /**
     * Placeholder
     * @type {string}
     */
    @Input('placeholder') private placeholder: string = 'Select ...';

    /**
     * Placeholder reference to translate
     * @type {string}
     */
    @Input('placeholderRefToTranslate') private placeholderRefToTranslate: string = 'base.selectOoo';

    /**
     * Language
     * @type {string}
     */
    @Input('language') private language: string = 'ru';

    /**
     * With checkboxes
     * @type {boolean}
     */
    @Input('withCheckboxes') private withCheckboxes: boolean = false;

    /**
     * Enable Select all button
     * @type {boolean}
     */
    @Input('selectAllButton') private selectAllButton: boolean = false;

    /**
     * Enable Deselect all button
     * @type {boolean}
     */
    @Input('deselectAllButton') private deselectAllButton: boolean = false;

    /**
     * Delay for opening dropdown on hover
     * @type {boolean}
     */
    @Input('delayForOpeningDropdown') private delayForOpeningDropdown: number = 250;

    /**
     * allowClear
     * @type {any}
     */
    @Input('allowClear') private allowClear: false;

    /**
     * validationEnabled
     * @type {any}
     */
    @Input('validationEnabled') private validationEnabled: false;

    private cursorLeavedTheEl: boolean = false;
    private extendsOptions = {};
    private openOnClick: boolean = false;
    private isValid: boolean = true;

    /**
     * Standart object understandable for plugin
     * @type {{value: string; text: string; selected: boolean; disabled: boolean}}
     */
    private standartObject = {
        id: '',
        text: ''
    };

    protected guid = null;

    /**
     * Get default options
     * @returns Object
     */
    public getDefaultOptions() {
        return {
            data: this.data,
            tags: this.tags,
            tokenSeparators: this.tokenSeparators,
            dropdownAutoWidth: this.dropdownAutoWidth,
            placeholder: this.placeholder,
            ajax: this.ajax,
            cache: this.cache,
            closeOnSelect: this.closeOnSelect,
            minimumInputLength: this.minimumInputLength,
            maximumSelectionLength: this.maximumSelectionLength,
            minimumResultsForSearch: this.minimumResultsForSearch,
            language: this.language,
            withCheckboxes: this.withCheckboxes,
            dropdownParent: $(".common-app-wrapper"),
            width: this.width,
            allowClear: this.allowClear
            // templateResult: (data) => "!!!!!!!!!!!!!!!!" + data
            // containerCssClass: 'dropdown',
            // dropdownCssClass: 'dropdown'
        };
    }

    setFocus() {
        setTimeout(() => {
            this.compRef.select2('focus')
        })
    }

    /**
     * Set default options
     * @param paramOptions
     */
    public setDefaultOptions(paramOptions) {
        this.extendsOptions = Object.assign(
            {}, // blank
            this.getDefaultOptions(),// default options
            paramOptions // options from params
        );
    }

    /**
     * Returned current state options for plugin
     * @returns Object
     */
    public getActualOptions(paramOptions = {}) {
        let opts = Object.assign(
            {}, // blank
            this.getDefaultOptions(),// default options
            this.extendsOptions, // actually options
            paramOptions // options from params
        );

        return opts;
    }

    addCustomClass() {
        let comp = this.compRef;
        if (this.wrapperClass) {
            $(this.compRef).addClass(this.wrapperClass);
        }
    }

    constructor(protected arrayProvider: ArrayProvider,
                protected translate: TranslateService,
                protected stringProvider: StringProivder,
                protected router: Router,
                protected cdr: ChangeDetectorRef) {
        this.overrideMultipleTemplate();

    }

    ngAfterViewInit() {
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            // TODO It simple solution, but not working; Need solution; https://github.com/angular/angular/issues/17880;
            // this._compiler.clearCache();

            // Bad solution, but working
            let placeholder =this.placeholderRefToTranslate?this.translate.instant(this.placeholderRefToTranslate):this.placeholder;
            this.reinitPlugin({placeholder: placeholder})
        });
        let self = this;
        this.router.events.subscribe(() => {
            self.close();
        });
        this.guid = Guid.newGuid();
        // start plugin after view init
        this.initPlugin();
        this.addCustomClass();
    }

    /**
     * Set selected values
     * @param selected
     */
    public setSelectedByIds(selected, withTrigger: boolean = false) {
        if (this.multiple == false) {
            this.selected = typeof selected == "string" ? selected : selected[0];
        } else {
            this.selected = selected;
        }

        this.setSelected();
        if (withTrigger == true) {
            this.compRef.trigger('select2:select')
        }
    }

    /**
     * Get array of data
     * @returns {Array<any>}
     */
    public getData(): Select2ListTypes {
        return this.data;
    }

    /**
     * Get data by index
     * @param i
     * @returns {Select2ItemType}
     */
    public getDataByIndex(i: number): Select2ItemType {
        let d = this.getData();
        let r: Select2ItemType;
        if (d && d.length > 0) {
            r = d[i];
        }

        return r;
    }

    getDataByText(text): Select2ItemType {
        let d = this.getData();
        let r: Select2ItemType;
        $.each(d, (k, i) => {
            if (i.text == text) {
                r = i;
                return false;
            }
        });

        return r;
    }

    /**
     * Adding ids to array of selected
     * @param selected
     */
    public addSelectedByIds(selected) {
        this.selected = this.arrayProvider.merge(this.selected, selected, {unique: true, sort: true});
        if (this.multiple == false) {
            this.selected = this.selected[0];
        }

        this.setSelected();
    }

    /**
     * Adding new objects to data and adding their ids to array of selected
     * @param objects
     */
    public addSelectedObjects(objects: Array<any>, withReinit: boolean = true) {
        this.data = this.data.concat(objects);

        if (this.multiple == false) {
            this.selected = [this.data[this.data.length - 1].id];
        } else {
            let self = this;
            objects.forEach(function (obj) {
                self.selected.push(obj.id);
            });
        }

        if (withReinit == true) {
            this.reinitPlugin({data: this.data});
        }
    }

    /**
     * Clear selected values
     */
    public clearSelected() {
        this.clearSelectedValues();
    }

    /**
     * Set placeholder
     * @param val
     */
    public setPlaceholder(val: string, clear: boolean = false): void {
        this.placeholder = val;
        this.reinitPlugin({placeholder: this.placeholder});
        if (clear) {
            this.clearSelected();
        }
    }

    /**
     * Clearing array of data
     * @param withReinit
     */
    public clearData(withReinit: boolean = true) {
        this.data = [];
        this.selected = [];
        this.clearDataInDOM();

        if (withReinit == true) {
            this.reinitPlugin({data: this.data});
        }
    }

    /**
     * Refreshing data without reset
     * @param data
     */
    public refreshData(data) {
        // not sure that it work (
        this.compRef.change();
    }

    /**
     * Clear selected values and data list
     * @param withReinit
     */
    public clear(withReinit: boolean = true) {
        this.clearSelected();
        this.clearData(withReinit);
    }

    /**
     * Setting new array of data
     * @param data
     * @param withReinit
     */
    public setData(data: Array<any>, withReinit: boolean = true) {
        this.clear(false);
        let _d = data.filter(function (o) {
            return !o.text ? false : true;
        })

        let _dSorted = _d.sort(function(a, b){
            if(a.text < b.text) return -1;
            if(a.text > b.text) return 1;
            return 0;
        })
        this.data = _dSorted;

        if (withReinit == true) {
            this.reinitPlugin({data: this.data});
        }

        if (this.value && this.value.filter(el => !!el).length) {
            this.setSelectedByIds(this.value.filter(el => !!el).map(el => el.Id));
        }
    }

    /**
     * Get selected ids
     * @returns {any}
     */
    public getSelected() {
        return this.compRef.val();
    }

    public getSelectedId() {
        return this.getSelected();
    }

    public getSelectedText(): Array<string | number> {
        let data = (<any>$(this.compRef)).select2('data');
        let res = [];
        if (data && data.length > 0) {
            $.each(data, function (k, o) {
                res.push(o.text);
            })
        }

        return res;
    }

    public getSelectedTextByIdForSingle(id: number): string {
        return this.compRef.select2('data')[0].text;
        ;
    }

    public getSelectedObject(): Select2ItemType {
        return <Select2ItemType>{
            id: this.getSelected(),
            text: this.getSelectedText()[0]
        }
    }

    removeDataById(id) {
        this.setData(this.getData().filter((i) => {
            return i.id != id;
        }), true)
    }

    /**
     * Disable plugin
     */
    public disable() {
        this.switchingDisablingPlugin(true);
    }

    /**
     * Enable plugin
     */
    public enable() {
        this.switchingDisablingPlugin(false);
    }

    /**
     * Open dropdown
     */
    public open() {
        // if (!this.openOnClick) {
        //     this.openOnClick = true;
        //     // this.compRef.select2("open");
        //     this.compRef.select2("open");
        //     let ddc = $(this.getDropdown().$dropdownContainer);
        //     ddc.attr('id', this.guid);
        //     let dd = ddc.find('.select2-dropdown');
        //     dd.css({opacity: 0, top: -10});
        //     dd.show();
        //     dd.stop();
        //     dd.animate({opacity: "1", top: "0px"}, 150, 'easeOutCubic', () => {
        //         dd.css({opacity: 1, top: 0});
        //     });
        // } else {
        //     this.openOnClick = false;
        //     // this.close();
        //     // if (!this.isOpen()) {
        //     //     this.compRef.select2("open");
        //     //     let ddc = $(this.getDropdown().$dropdownContainer);
        //     //     ddc.attr('id', this.guid);
        //     //     let dd = ddc.find('.select2-dropdown');
        //     //     dd.css({opacity: 0, top: -10});
        //     //     dd.show();
        //     //     dd.stop();
        //     //     dd.animate({opacity: "1", top: "0px"}, 150, 'easeOutCubic', () => {
        //     //         dd.css({opacity: 1, top: 0});
        //     //     });
        //     // }
        // }
    }

    /**
     * Close dropdown
     */
    public close() {
        // if (!this.openOnHover) {
        //     //this.compRef.select2("close");
        //     let dd = $(this.getDropdown().$dropdownContainer).find('.select2-dropdown');
        //     dd.stop();
        //     dd.animate({opacity: "0", top: "-10px"}, 150, 'easeOutCubic', () => {
        if (this.compRef && this.compRef.select2) {
            this.compRef.select2("close");
        }

        //     })
        // } else {
        //     let dd = $(this.getDropdown().$dropdownContainer).find('.select2-dropdown');
        //     dd.stop();
        //     dd.animate({opacity: "0", top: "-10px"}, 150, 'easeOutCubic', () => {
        //         this.compRef.select2("close");
        //     })
        // }
    }

    public isOpen() {
        return !!this.compRef.data('select2').dropdown.$dropDownContainer
    }

    private getDropdown() {
        return this.compRef.data('select2').dropdown;
    }

    /**
     * Show html in text option of data as simple text
     * @param data
     * @returns {Array}
     */
    public dataHtmlToText(data = []) {
        let escData = [];
        data.forEach(function (obj, key) {
            // let escText = '<xmp>' + obj.text + '</xmp>';
            let escText = obj.text.replace("<", "&lt;").replace(">", "&gt;");
            obj.text = escText;
            escData[key] = obj;
        });

        return escData;
    }

    /**
     * Turning object of objects to array of objects understandable for plugin
     */
    public turnObjectOfObjectToStandart(obj = {}, comp: Select2ConvertObject = {
        key: 'id',
        text: 'text',
        selected: 'selected',
        disabled: 'disabled'
    }): Array<Select2ItemType> {
        let res = [];
        let self = this;
        $.each(obj, function (key, dirtyObj) {
            res.push(self.turnObjectToStandart(dirtyObj, comp));
        });

        return res;
    }

    /**
     * Turning array of objects to array of objects understandable for plugin
     */
    public turnArrayOfObjectToStandart(arr = [], comp: Select2ConvertObject = {
        key: 'id',
        text: 'text',
        selected: 'selected',
        disabled: 'disabled'
    }): Array<Select2ItemType> {
        let res = [];
        let self = this;
        arr.forEach(function (dirtyObj) {
            res.push(self.turnObjectToStandart(dirtyObj, comp));
        });

        return res;
    }

    /**
     * Turning simple array to standart object understandable for plugin
     * @param array
     * @returns {Array}
     */
    public turnArrayToStandart(array: Array<any> = []): Array<Select2ItemType> {
        let data = [];
        array.forEach(function (val, key) {
            data.push({id: key, text: val});
        });

        return data;
    }

    /**
     * Turning simple object to standart object understandable for plugin
     * @param array
     * @returns {Array}
     */
    public turnSimpleObjectToStandart(dirtyObj = {}): Array<Select2ItemType> {
        let data = [];
        for (let e in dirtyObj) {
            data.push({id: e, text: dirtyObj[e]});
        }
        ;

        return data.sort(function (a, b) {
            return (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0);
        });
    }

    /**
     * Turning any crazy object to object understandable for plugin
     */
    public turnObjectToStandart(dirtyObj = {}, comp = {
        key: 'id',
        text: 'text'
    }): Select2ItemType {
        let obj = Object.assign({}, this.standartObject);
        obj.id = dirtyObj[comp.key];
        obj.text = dirtyObj[comp.text];

        return obj;
    }


    /**
     * Disable/Enable plugin
     * @param val
     */
    private switchingDisablingPlugin(val: boolean) {
        this.compRef.prop("disabled", val);
    }

    /**
     * Applying object selected and displaying him
     * @param selected
     */
    setSelected(selected: any = []) {
        if (!selected || selected.length == 0) {
            selected = this.selected;
        }
        // if validation is active
        if (this.validationEnabled && (!selected || (Array.isArray(selected) && selected.length === 0))) {
            this.setValidation(false);
        } else {
            this.setValidation(true);
        }

        this.compRef.val(selected).trigger('change');
    }

    /**
     * Remove option tag in DOM of component
     */
    private clearDataInDOM() {
        this.compRef.find('option').remove();
    }

    /**
     * Clearing selected values and displaying it
     */
    private clearSelectedValues() {
        this.compRef.val(null).trigger('change');
    }


    /**
     * Re init jQuery plugin with new options
     * @param paramOptions
     */
    public reinitPlugin(paramOptions: Object = {}) {
        this.compRef.select2("destroy");
        this.initPlugin(true, paramOptions)
    }

    /**
     * Init jQuery plugin with options
     */
    initPlugin(reinit: boolean = false, paramOptions = {}) {
        if (!reinit) {
            this.compRef = $(this.compRef.nativeElement);
            if (this.firstEmpty == true) {
                this.compRef.append($('<option value="">EMPTY</option>'));
            }
        }
        let options = $.extend(true, this.getActualOptions(), paramOptions);
        if (this.withCheckboxes) {
            options = this.enableCheckboxes(options);
        }

        this.compRef = this.compRef.select2(options);

        // Fix bugs with incorrect working highlighting
        let compData = this.compRef.data('select2');
        let self = this;
        compData.results.highlightFirstItem = function () {
            let $options = compData.$results
                .find('.select2-results__option[aria-selected]');

            let $selected = $options.filter('[aria-selected=true]');

            if (self.withCheckboxes) {
                // Check if there are any selected options
                if ($selected.length == 0) {
                    // If there are no selected options, highlight the first option
                    // in the dropdown
                    $options.first().trigger('mouseenter');
                }
            } else {
                // Check if there are any selected options
                if ($selected.length > 0) {
                    // If there are selected options, highlight the first
                    $selected.first().trigger('mouseenter');
                } else {
                    // If there are no selected options, highlight the first option
                    // in the dropdown
                    $options.first().trigger('mouseenter');
                }
            }

            compData.results.ensureHighlightVisible();
        }

        // Events
        this.bindEventsToEmmiters();

        // Displaying selections
        this.setSelected();
        $('b[role="presentation"]').hide();
        $('.select2-selection__arrow').each(function () {
            if ($(this).find("i").length == 0) {
                $(this).append('<i class="icons-down icon"></i>');
            }
        });


        // if (this.openOnHover) {
        //     let timeoutHandler = null;
        //     $(this.compRef).next(".select2").mouseenter(function () {
        //         self.cursorLeavedTheEl = false;
        //         timeoutHandler = setTimeout(() => {
        //             self.open();
        //         }, self.delayForOpeningDropdown)
        //
        //     });
        //     $(document).on("mouseleave", ".select2-container", (e) => {
        //         if ($((<any>e).toElement || (<any>e).relatedTarget).closest(".select2-container").length == 0) {
        //             clearTimeout(timeoutHandler);
        //             self.cursorLeavedTheEl = true;
        //             self.close();
        //         }
        //     });
        //     $(document).on("mouseout", ".select2-container", (e) => {
        //         if ($((<any>e).toElement || (<any>e).relatedTarget).closest(".select2-container#" + this.guid).length == 0) {
        //             clearTimeout(timeoutHandler);
        //             self.cursorLeavedTheEl = true;
        //             self.close();
        //         }
        //     });
        // } else {
        $(this.compRef).next(".select2").click(function () {
            self.open();
        });

        // }
    }

    private selectAll(): void {
        this.selected = [];
        let allOpts = this.compRef.find('option');
        allOpts.each((k, el) => {
            this.selected.push($(el).val());
        });

        this.setSelected();
        this.reinitPlugin();
    }

    private deselectAll(): void {
        this.selected = [];
        this.setSelected();
        this.reinitPlugin();
    }

    private enableCheckboxes(options): any {
        options.templateResult = this.templateResult;
        // options.templateSelection = this.templateSelection;
        options.closeOnSelect = false;
        options.multiple = true;
        options.maximumSelectionLength = 0;
        options.selectOnClose = false;
        options.escapeMarkup = function (markup) {
            return markup;
        };

        return options;
    }

    private templateResult(repo) {
        if (repo.loading) return repo.text;
        let checked = repo.selected ? 'icons-check' : '';
        let markup =
            "<span>" +
            "<i class='icon checkbox-in-select-2 " + checked + "' aria-hidden='true'></i>" +
            "<span class='select2-option-text-checkbox'>" + repo.text + "</span>" +
            "</span>";

        return markup;
    }

    private changeStateOfCheckbox(e: any, selected: boolean) {
        if (e.params.originalEvent) {
            let el = $(e.params.originalEvent.currentTarget);
            selected ? this.enableCheckbox(el) : this.disableCheckbox(el);
        }

    }

    private enableCheckbox(el) {
        // el.find('i').removeClass('fa-square-o').addClass('icons-check');
        el.find('i').addClass('icons-check');
    }

    private disableCheckbox(el) {
        // el.find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        el.find('i').removeClass('icons-check');
    }

    /**
     * Bind event onSearch
     */
    private triggerOnSearch() {
        var self = this;
        if (this.minimumResultsForSearch != Infinity) {
            $(document).on(
                'keyup',
                '.select2-container .select2-search__field',
                function (e) {
                    //Do key up
                    self.onSearch.emit(e);
                });

        }
    }

    private triggerAfterScroll() {
        var self = this;
        if (this.minimumResultsForSearch != Infinity) {
            $(document).on(
                'keyup',
                '.select2-container .select2-search__field',
                function (event) {
                    setTimeout(() => {
                        self.afterSearch.emit(event);
                    })
                });
        }
    }

    private getDropdownElByIndex(index) {
        let el = $('.select2-container--open .select2-dropdown');
        if (!el) {
            return false
        }
        ;
        // /*debugger*/;

        return el.eq(0).find('li.select2-results__option')[index];
    }

    private bindEventsToEmmiters() {
        let flagNotOpenNow = false;
        let flagCalled = 0;
        let self = this;
        let th = null;
        // https://stackoverflow.com/questions/5464695/jquery-change-event-being-called-twice
        this.compRef.unbind('select2:select');
        this.compRef.unbind('select2:unselect');
        this.compRef.unbind('select2:open');
        this.compRef.unbind('select2:closing');
        this.compRef.unbind('select2:close');
        this.compRef.unbind('select2:opening');
        //
        this.compRef.on("select2:opening", function (e) {
            if (flagNotOpenNow) {
                e.preventDefault();
                return false;
            }
        });
        this.compRef.on("select2:open", function (e) {
            e.stopPropagation();
            e.preventDefault();
            // /*debugger*/
            // Bind scroll
            // self.triggerEventsForScroll(th, e);

            // Bind event onSearch
            self.triggerOnSearch();

            // set selected to event
            e.selected = self.selected;

            // emitters
            self.onOpen.emit(e);
            self.onAnyEvent.emit(e);

            // Bind event afterScroll
            self.triggerAfterScroll();

            // $('.js-scrollbar-target-adv').on('scroll', function () {
            //     self.close();
            // });

            if (self.withCheckboxes) {
                setTimeout(() => {
                    $.each(self.compRef.select2('data'), (k, o) => {
                        if (self.getSelected().indexOf(o.id) > -1) {
                            let el = self.getDropdownElByIndex(o.element.index);
                            if (el) {
                                self.enableCheckbox($(el));
                            }
                        }
                    })
                });
            }

            // self.compRef.select2('close');
            //  let ddc = $(self.getDropdown().$dropdownContainer);
            //  ddc.attr('id', self.guid);
            //  let dd = ddc.find('.select2-dropdown');
            //  dd.hide();
        });
        this.compRef.on("select2:closing", function (e) {
            if (self.openOnHover && !self.cursorLeavedTheEl) {
                e.preventDefault();
                return false;
            }
            // destroy listener on closing dropdown
            // $('.js-scrollbar-target-adv').off('scroll');
        });
        this.compRef.on("select2:close", function (e) {
            e.selected = self.selected;
            // $('.select2-selection__choice__remove').click(function (e) {
            //     flagNotOpenNow = true;
            // })

            self.onClose.emit(e);
            self.onAnyEvent.emit(e);
        });

        this.compRef.on("select2:select", function (e) {
            if (self.multiple == false) {
                self.cursorLeavedTheEl = true;
                self.close();
            } else {
                self.checkboxUpdate();
            }

            e.selected = self.selected;
            if (self.withCheckboxes) {
                self.changeStateOfCheckbox(e, true);
            }

            self.onSelect.emit(e);
            self.onAnyEvent.emit(e);

        });
        this.compRef.on("select2:unselect", function (e) {
            e.selected = self.selected;
            if (self.withCheckboxes && e.params.originalEvent) {
                self.changeStateOfCheckbox(e, false);
                self.checkboxUpdate();
            }
            let opts = self.compRef.data('select2').options;
            opts.set('disabled', true);
            setTimeout(function () {
                opts.set('disabled', false);
            }, 1);
            self.onUnselect.emit(e);
            self.onAnyEvent.emit(e);
        });
    }

    private checkboxUpdate() {
        this.close();
        this.compRef.select2('open');
    }

    private overrideMultipleTemplate() {
        (<any>$.fn).select2.amd.require('select2/selection/multiple').prototype.selectionContainer = function () {
            return $(
                '<li class="select2-selection__choice">' +
                ' <div class="select2-selection__choice__remove" role="presentation">' +
                '   <i class="icons icons-closedelete icon small"></i>' +
                ' </div>' +
                '</li>'
            )
        }
    }
    /**
     * Check validation
     * @param selected
     */
    public checkValidation(selected: any = []) {
        // if validation is active
        if (this.validationEnabled){
            if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                this.setValidation(false);
            } else {
                this.setValidation(true);
            }
        }
    }
    /**
     * Get validation value
     */
    public getValidation() {
        return this.isValid;
    }
    public setValidation(valid: boolean) {
        this.isValid = valid;
        if (valid) {
            this.compRef.parent().removeClass('error-validation');
        } else {
            this.compRef.parent().addClass('error-validation');
        }
    }
}

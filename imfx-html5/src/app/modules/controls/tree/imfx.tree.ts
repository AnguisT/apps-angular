/**
 * Created by Sergey Trizna on 13.01.2017.
 */
// See https://github.com/mar10/fancytree/
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
// Loading jQuery
import * as $ from "jquery";
// Loading jQueryUI
import "style-loader!jquery-ui-bundle/jquery-ui.min.css";
import "style-loader!jquery-ui-bundle/jquery-ui.structure.min.css";
import "style-loader!jquery-ui-bundle/jquery-ui.theme.min.css";
import "jquery-ui-bundle/jquery-ui.min.js";
// Fancytree
import "style-loader!jquery.fancytree/dist/skin-lion/ui.fancytree.min.css";
import "jquery.fancytree/dist/jquery.fancytree-all.min.js";
import {
    TreeStandardConvertParamsType,
    TreeStandardItemType,
    TreeStandardListOfPointersToNodesTypes,
    TreeStandardListTypes
} from "./types";

declare var window: any;
@Component({
    selector: 'imfx-controls-tree',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})

export class IMFXControlsTreeComponent {
    @Output() onBlurTree: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onInit: EventEmitter<any> = new EventEmitter<any>();
    @Output() onFocusTree: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRestore: EventEmitter<any> = new EventEmitter<any>();
    @Output() onActivate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onBeforeActivate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onBeforeExpand: EventEmitter<any> = new EventEmitter<any>();
    @Output() onBeforeSelect: EventEmitter<any> = new EventEmitter<any>();
    @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCollapse: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCreateNode: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDblClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDeactivate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onExpand: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEnhanceTitle: EventEmitter<any> = new EventEmitter<any>();
    @Output() onFocus: EventEmitter<any> = new EventEmitter<any>();
    @Output() onKeydown: EventEmitter<any> = new EventEmitter<any>();
    @Output() onKeypress: EventEmitter<any> = new EventEmitter<any>();
    @Output() onLazyLoad: EventEmitter<any> = new EventEmitter<any>();
    @Output() onLoadChildren: EventEmitter<any> = new EventEmitter<any>();
    @Output() onLoadError: EventEmitter<any> = new EventEmitter<any>();
    @Output() onModifyChild: EventEmitter<any> = new EventEmitter<any>();
    @Output() onPostProcess: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRenderNode: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRenderTitle: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    @Output() onMouseEnter: EventEmitter<any> = new EventEmitter<any>();
    @Output() onMouseLeave: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDrop: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDragOver: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDragLeave: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDragEnter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Reference to current component
     */
    @ViewChild('imfxControlsTree') private compRef;
    @ViewChild('imfxControlsTableTree') private compRefTable;

    /**
     * Source for plugin
     * @type {Array}
     */
    @Input('source') private source: Array<Object> = [];

    /**
     * Make sure, active nodes are visible (expanded)
     * @type {boolean}
     */
    @Input('activeVisible') private activeVisible: boolean = true;

    /**
     * Enable WAI-ARIA support
     * @type {boolean}
     */
    @Input('aria') private aria: boolean = false;

    /**
     * Automatically activate a node when it is focused using keyboard
     * @type {boolean}
     */
    @Input('autoActivate') private autoActivate: boolean = true;

    /**
     * Automatically collapse all siblings, when a node is expanded
     * @type {boolean}
     */
    @Input('autoCollapse') private autoCollapse: boolean = false;

    /**
     * Automatically scroll nodes into visible area
     * @type {boolean}
     */
    @Input('autoScroll') private autoScroll: boolean = false;

    /**
     * 1:activate, 2:expand, 3:activate and expand, 4:activate (dblclick expands)
     * @type {number}
     */
    @Input('clickFolderMode') private clickFolderMode: number = 4;

    /**
     * Show checkboxes
     * @type {boolean}
     */
    @Input('checkbox') private checkbox: boolean = false;

    /**
     * 0:quiet, 1:normal, 2:debug
     * @type {number}
     */
    @Input('debugLevel') private debugLevel: number = window.IMFX_VERSION == 'dev_version' ? 2 : 0;

    /**
     * Disable control
     * @type {boolean}
     */
    @Input('disabled') private disabled: boolean = false;

    /**
     * Set focus when node is checked by a mouse click
     * @type {boolean}
     */
    @Input('focusOnSelect') private focusOnSelect: boolean = false;

    /**
     * Escape `node.title` content for display
     * @type {boolean}
     */
    @Input('escapeTitles') private escapeTitles: boolean = false;

    /**
     * Generate id attributes like <span id='fancytree-id-KEY'>
     * @type {boolean}
     */
    @Input('generateIds') private generateIds: boolean = false;

    /**
     * Used to generate node id´s like <span id='fancytree-id-<key>'>
     * @type {string}
     */
    @Input('idPrefix') private idPrefix: string = "ft_";

    /**
     * Display node icons
     * @type {boolean}
     */
    @Input('icon') private icon: boolean | string = false;

    /**
     * Support keyboard navigation
     * @type {boolean}
     */
    @Input('keyboard') private keyboard: boolean = true;

    /**
     * Used by node.getKeyPath() and tree.loadKeyPath()
     * @type {string}
     */
    @Input('keyPathSeparator') private keyPathSeparator: string = "/";

    /**
     * 1: root node is not collapsible
     * @type {number}
     */
    @Input('minExpandLevel') private minExpandLevel: number = 1;

    /**
     * Navigate to next node by typing the first letters
     * @type {boolean}
     */
    @Input('quicksearch') private quicksearch: boolean = true;

    /**
     * Enable RTL (right-to-left) mode
     * @type {boolean}
     */
    @Input('rtl') private rtl: boolean = false;

    /**
     * 1:single, 2:multi, 3:multi-hier
     * @type {number}
     */
    @Input('selectMode') private selectMode: number = 2;

    /**
     * Whole tree behaves as one single control
     * @type {number}
     */
    @Input('tabindex') private tabindex: number = 0;

    /**
     * Node titles can receive keyboard focus
     * @type {boolean}
     */
    @Input('titlesTabbable') private titlesTabbable: boolean = false;

    /**
     * Use title as tooltip (also a callback could be specified)
     * @type {boolean}
     */
    @Input('tooltip') private tooltip: boolean = false;

    /**
     * Extensions for plugin
     * @type {Array}
     */
    @Input('extensions') private extensions: Array<string> = [];

    /**
     * Table tree config
     * @type {Object}
     */
    @Input('table') private table: Object = null;

    /**
     * Callback for rendering columns
     * @type {Function}
     */
    @Input()
    public renderColumns: Function;

    /**
     * Setup filter extension for plugin
     */
    @Input('ext_filter') private ext_filter: Object = {};


    /**
     * True if plugin was already initialised
     * @type {boolean}
     */
    private inited: boolean = false;

    public constructor(private cdr: ChangeDetectorRef) {
    }

    /**
     * Getter for private inited: boolean
     * @type {boolean}
     */
    public isInited(): boolean {
        return this.inited;
    }

    /**
     * Example of correct object for plugin
     * @type {{id: string; text: string}}
     */
    private standartObject = {
        key: "",
        title: "",
        folder: false,
        children: [],
        dirtyObj: {}

    };

    private checkIfIsTreeMode: boolean = false;

    private extendsOptions = {};

    /**
     * Get default options
     */
    public getDefaultOptions() {
        let defaults = {
            source: this.source,
            activeVisible: this.activeVisible,
            aria: this.aria,
            autoActivate: this.autoActivate,
            autoCollapse: this.autoCollapse,
            autoScroll: this.autoScroll,
            clickFolderMode: this.clickFolderMode,
            checkbox: this.checkbox,
            debugLevel: this.debugLevel,
            disabled: this.disabled,
            focusOnSelect: this.focusOnSelect,
            escapeTitles: this.escapeTitles,
            generateIds: this.generateIds,
            idPrefix: this.idPrefix,
            icon: this.icon,
            keyboard: this.keyboard,
            keyPathSeparator: this.keyPathSeparator,
            minExpandLevel: this.minExpandLevel,
            quicksearch: this.quicksearch,
            rtl: this.rtl, //
            selectMode: this.selectMode,
            tabindex: this.tabindex,
            titlesTabbable: this.titlesTabbable,
            tooltip: this.tooltip,
            extensions: this.extensions,
            filter: this.ext_filter,
            table: this.table,
            renderColumns: this.renderColumns,
        };
        if (this.extensions.indexOf("table") + 1) {
            defaults.table = this.table;
            defaults.renderColumns = this.renderColumns;
        }
        return defaults;
    }

    /**
     * Turning array of objects to array of objects understandable for plugin
     */
    public turnArrayOfObjectToStandart(arr = [], comp: TreeStandardConvertParamsType = {
        key: 'id',
        title: 'text',
        children: 'children'
    }): TreeStandardListTypes {
        let res = [];
        let self = this;
        arr.forEach(function (dirtyObj) {
            res.push(self.turnObjectToStandart(dirtyObj, comp));
        });

        return res;
    }

//     public renderNode(event, data) {
//         // debugger
//         // return this.compRef.renderNode(event,data)
//
// //         renderNode: function(event, data) {
//             // Optionally tweak data.node.span
//             var node = data.node;
//             if(node.data.cstrender){
//                 debugger;
// //                 var $span = $(node.span);
// //                 $span.find("> span.fancytree-title").text(">> " + node.title).css({
// //                     fontStyle: "italic"
// //                 });
// //                 $span.find("> span.fancytree-icon").css({
// // //                      border: "1px solid green",
// //                     backgroundImage: "url(skin-custom/customDoc2.gif)",
// //                     backgroundPosition: "0 0"
// //                 });
//             }
//     }

    /**
     * Turning any crazy object to object understandable for plugin
     */
    public turnObjectToStandart(dirtyObj, comp: TreeStandardConvertParamsType = {
        key: 'id',
        title: 'text',
        children: 'children',
        additionalData: ''
    }): TreeStandardItemType {
        let obj = Object.assign({}, this.standartObject);
        obj.key = dirtyObj[comp.key];
        obj.title = dirtyObj[comp.title];
        if (dirtyObj[comp.children] && dirtyObj[comp.children].length > 0) {
            obj.children = this.turnArrayOfObjectToStandart(dirtyObj[comp.children], comp);
        } else {
            delete obj.children;
        }

        obj.folder = obj.children ? true : false;
        // obj.additionalData = comp.additionalData?dirtyObj[comp.additionalData]:{};
        obj.dirtyObj = dirtyObj;

        return obj;
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
     * @returns {{}&{data: Array<any>, tag: boolean, tokenSeparators: (","|" ")[], placeholder: string, ajax: null, cache: boolean}&{data: Array<any>, tag: boolean, tokenSeparators: (","|" ")[], placeholder: string, ajax: null, cache: boolean}}
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

    ngAfterViewInit() {
        this.checkIfIsTreeMode = this.isTree();
        // this.cdr.detectChanges();
        this.initPlugin();
    }

    isTree() {
        return !!(this.extensions.indexOf("table") + 1)
    }

    /**
     * Set option
     * @param optionName
     * @param optionVal
     */
    public setOption(optionName: string, optionVal: any) {
        this.compRef.fancytree('option', optionName, optionVal);
    }

    /**
     * Get option
     * @param optionName
     */
    public getOption(optionName) {
        this.compRef.fancytree('option', optionName);
    }

    /**
     * Get the Fancytree instance for a tree widget
     * @returns {any}
     */
    public getTree() {
        return this.compRef.fancytree("getTree");
    }

    /**
     * Render node
     * @param node
     */
    public render(node) {
        node.render();
    }

    /**
     * Return RootNode
     * @returns {any}
     */
    public getRootNode() {
        return this.compRef.fancytree("getRootNode");
    }

    /**
     * Expand all
     */
    public expandAll(): void {
        this.getRootNode().visit(function (node) {
            node.setExpanded(true);
        });
    }

    /**
     * Collapse all
     */
    public collapseAll(): void {
        this.getRootNode().visit(function (node) {
            node.setExpanded(false);
        });
    }

    /**
     * Tooggle expand
     */
    toggleExpandAll(): void {
        this.getRootNode().visit(function (node) {
            node.toggleExpanded();
        });

    }

    /**
     * Get a FancytreeNode instance
     * @returns {any}
     */
    getActiveNode() {
        return this.compRef.fancytree("getActiveNode");
    }

    /**
     * Get node by event
     * @param event
     * @returns {any}
     */
    public getNodeByEvent(event) {
        return (<any>$).ui.fancytree.getNode(event);
    }

    /**
     * Get dictionary
     * @returns {any}
     */
    public getDic(): Array<any> {
        let tree = this.getTree();

        return tree.toDict(true);
    }

    /**
     * Set key as active
     * @param key
     */
    public activateKey(key): void {
        this.compRef.activateKey(key);
    }

    /**
     * Sort root node of tree
     */
    public sortTree(): void {
        this.getRootNode().sortChildren(null, true);
    }

    /**
     * Sort active branch
     */
    public sortBranchByNode(node?: any): void {
        if (!node) {
            var node = this.getActiveNode();
        }
        let cmp = function (a, b) {
            a = a.title.toLowerCase();
            b = b.title.toLowerCase();
            return a > b ? 1 : a < b ? -1 : 0;
        };
        node.sortChildren(cmp, false);
    }

    /**
     * Add object of source to root node
     * @param item
     */
    public addToRootNode(item: Object): void {
        this.addToNode(this.getRootNode(), item);
    }

    /**
     * add object of source to node from parameter
     * @param node
     * @param item
     */
    public addToNode(node: any, item: Object): void {
        node.addChildren(item);
    }

    /**
     * Set source to plugin
     * @param items
     */
    public setSource(items: Array<Object>): void {
        this.getTree().reload(items);
    }

    /**
     * Select all
     * @returns {boolean}
     */
    public selectAll() {
        this.getTree().visit((node) => {
            this.setSelectedNode(node);
        });

        return true;
    }


    /**
     * Select all
     * @returns {boolean}
     */
    public unSelectAll() {
        this.getTree().visit(function (node) {
            this.setUnselectedNode(node);
        });

        return false;
    }

    /**
     * to dictionary (but why ?)
     */
    // public toDict(node?:any) {
    //     if(!node) {
    //         var node = this.getActiveNode();
    //     }
    // }

    /**
     * Get selected nodes
     */
    public getSelected(): any[] {
        let tree = this.getTree();
        return tree.getSelectedNodes();
    }

    public getCheckedNodes(): any {
        let els = $(this.compRef).find('.fancytree-checkbox.fancytree-checkboxCheck').parent();
        let nodes = els.map((i, el) => {
            return this.getNodeByEvent(el);
        });
        return nodes;
    }

    /**
     * Set selected by object like standard object structure
     */
    public setSelectedByArrayOfStandartObject(objs: TreeStandardListOfPointersToNodesTypes): void {
        let tree = this.getTree();
        let self = this;

        objs.forEach(function (obj) {
            let node = tree.getNodeByKey(obj.key);
            self.setSelectedNode(node);
        })
    }

    /**
     * Set selected by array of nodes
     * @param ids
     */
    public setSelectedByArrayOfNodes(ids: Array<number>) {
        let tree = this.getTree();
        let self = this;
        ids.forEach(function (id) {
            let node = tree.getNodeByKey(id);
            if (node !== null) {
                self.setSelectedNode(node);
            }
        });
        this.cdr.markForCheck();
    }

    /**
     * Set selected node by node id
     * @param id
     */
    public setSelectedById(id: number): void {
        let tree = this.getTree();
        let node = tree.getNodeByKey(id);
        if (node) {
            this.setSelectedNode(node);
        }
    }

    /**
     * Set selected by node
     * @param node
     */
    public setSelectedNode(node): void {
        node.setSelected(true);
    }

    /**
     * Set unselected by node
     * @param node
     */
    public setUnselectedNode(node): void {
        node.setSelected(false);
    }

    public setCheckboxForNodes(selected) {
        selected.forEach((selectedNode) => {
            if (selectedNode.span) {
                let checkbox = $(selectedNode.span).find('.fancytree-checkbox');
                $(checkbox).toggleClass('fancytree-checkboxCheck');
            } else {
                this.setExpandedParent(selectedNode);
                // selectedNode.parent.setExpanded(true);
                this.cdr.markForCheck();
                let checkbox = $(selectedNode.span).find('.fancytree-checkbox');
                $(checkbox).toggleClass('fancytree-checkboxCheck');
            }
        });
    }

    setExpandedParent(node) {
        if (node.parent !== null) {
            this.setExpandedParent(node.parent);
        }
        node.setExpanded(true);
    }

    /**
     * Refresh plugin
     */
    public refreshPlugin(): void {
        this.compRef.fancytree({render: true});
    }

    /**
     * Re init jQuery plugin with new options (not working)
     * @param paramOptions
     */
    // public reinitPlugin(paramOptions: Object = {}) {
    //     var tree = this.getTree();
    //     let opts = Object.assign(this.getActualOptions(), paramOptions)
    //     let optionsWithEvents = Object.assign(opts, this.bindEventsToEmmiters());
    //     tree.reload(optionsWithEvents).done(function(){
    //         alert("reloaded");
    //     });
    //     // this.initPlugin(paramOptions);
    // }


    /**
     * Filter
     * @param test
     * @param obj
     */
    public filter(test: string, obj: Object = {}): void {
        this.compRef.fancytree("getTree").filterNodes(test, obj);
    }

    /**
     * Clear filter
     */
    public clearFilter() {
        this.compRef.fancytree("getTree").clearFilter();
    }

    /**
     * Filter with callback
     * @param str
     * @param callback
     */
    public filterCallback(str: string, callback: Function) {
        let tree = this.getTree();
        tree.filterNodes(function (node) {
            return callback(str, node);
        });
    }

    /**
     * Init jQuery plugin with options
     */
    private initPlugin(paramOptions: Object = {}) {
        let self = this;
        let opts = Object.assign(this.getActualOptions(), paramOptions)
        let optionsWithEvents = Object.assign(opts, this.bindEventsToEmmiters());
        this.checkIfIsTreeMode = this.isTree();
        this.cdr.detectChanges();
        this.compRef = this.checkIfIsTreeMode ? $(this.compRefTable.nativeElement) : $(this.compRef.nativeElement)
        // debugger;
        // if(optionsWithEvents.icon){
        //     optionsWithEvents.icon = function(event, data) {
        //         if( data.node.isFolder() ) { return "icon icon-right"; }
        //     };
        // }

        this.compRef.fancytree(optionsWithEvents).on("mouseenter", ".fancytree-title", function (event) {
            let toEmit = {
                event: event,
                node: self.getNodeByEvent(event),
            };

            self.onMouseEnter.emit(toEmit);
        }).on("mouseleave", ".fancytree-title", function (event) {
            // let toEmit = {
            //     event: event,
            //     node: self.getNodeByEvent(event),
            // };
            //
            // self.onMouseLeave.emit(toEmit);
        }).on("dragleave", function (event) {
            event.preventDefault();
            // event.stopPropagation();
            self.onDragLeave.emit(event);
            //
        }).on("drop", function (event) {
            event.preventDefault();
            // event.stopPropagation();
            self.onDrop.emit(event)
        })
        .on("dragenter", function (event) {
            event.preventDefault();
            // event.stopPropagation();
            self.onDragEnter.emit(event);
        }).on("dragover", function (event) {
            event.preventDefault();
            self.onDragOver.emit(event);
        });

        if(this.checkbox == true){
            this.compRef.on('click', '.fancytree-checkbox', function (event) {
                $(event.target).toggleClass('fancytree-checkboxCheck');
            });

            this.compRef.on('dblclick', '.fancytree-checkbox', function (event) {
                event.preventDefault();
                event.stopPropagation();
                $(event.target).toggleClass('fancytree-checkboxCheck');
                self.selectAllChildren(event);
                return false
            });
        }

        this.inited = true;
    }

    public selectAllChildren(event){
        let node = this.getNodeByEvent(event);
        node.selected = !node.selected;
        $.each(node.children, (k, ch) => {
            ch.selected = node.selected;
            $(ch.span).find('.fancytree-checkbox').toggleClass('fancytree-checkboxCheck');
        })
    }

    public getNodeByElement(el): any {
        return (<any>$).ui.fancytree.getNode(el[0])
    }

    private bindEventsToEmmiters() {
        let self = this;
        return {
            blurTree: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onBlurTree.emit(toEmit);
            },
            create: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onCreate.emit(toEmit);
            },
            init: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onInit.emit(toEmit);
            },
            focusTree: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onFocusTree.emit(toEmit);
            },
            restore: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onRestore.emit(toEmit);
            },
            activate: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onActivate.emit(toEmit);
            },
            beforeActivate: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onBeforeActivate.emit(toEmit);
            },
            beforeExpand: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onBeforeExpand.emit(toEmit);
            },
            beforeSelect: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onBeforeSelect.emit(toEmit);
            },
            blur: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onBlur.emit(toEmit);
            },
            click: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onClick.emit(toEmit);
            },
            collapse: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onCollapse.emit(toEmit);
            },
            createNode: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onCreateNode.emit(toEmit);
            },
            dblclick: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onDblClick.emit(toEmit);
            },
            deactivate: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onDeactivate.emit(toEmit);
            },
            expand: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onExpand.emit(toEmit);
            },
            enhanceTitle: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onEnhanceTitle.emit(toEmit);
            },
            focus: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onFocus.emit(toEmit);
            },
            keydown: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onKeydown.emit(toEmit);
            },
            keypress: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onKeypress.emit(toEmit);
            },
            lazyLoad: function (event, data) {
                // return children or any other node source
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onClick.emit(toEmit);
            },
            loadChildren: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onLoadChildren.emit(toEmit);
            },
            loadError: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onLoadError.emit(toEmit);
            },
            modifyChild: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onModifyChild.emit(toEmit);
            },
            postProcess: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onPostProcess.emit(toEmit);
            },
            renderNode: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onRenderNode.emit(toEmit);
            },
            renderTitle: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };
                self.onRenderTitle.emit(toEmit);
            },
            select: function (event, data) {
                let toEmit = {
                    event: event,
                    data: data
                };

                self.onSelect.emit(toEmit);
            },
        }
    }
}

import {
  Component, ViewEncapsulation, Input, Output, EventEmitter, HostListener, ElementRef,
  ViewChild
} from '@angular/core';
import { ModalConfig } from '../../modal/modal.config';
import {
  LayoutManagerDefaults, LayoutManagerModel, LayoutType
} from './models/layout.manager.model';
import { LayoutManagerService } from './services/layout.manager.service';
import { SaveLayoutModalComponent } from './modals/save.layout.modal/save.layout.modal.component';
import { SaveLayoutModalProvider } from './modals/save.layout.modal/save.layout.modal.provider';
import { LoadLayoutModalProvider } from './modals/load.layout.modal/load.layout.modal.provider';
import { LoadLayoutModalComponent } from './modals/load.layout.modal/load.layout.modal.component';
import { IMFXModalProvider } from '../../imfx-modal/proivders/provider';
import { IMFXModalComponent } from '../../imfx-modal/imfx-modal';

@Component({
  selector: 'layout-manager',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    LayoutManagerService,
    SaveLayoutModalProvider,
    LoadLayoutModalProvider
  ],
  entryComponents: [
    SaveLayoutModalComponent,
    LoadLayoutModalComponent
  ]
})

export class LayoutManagerComponent {
  @Input() layoutType: LayoutType = LayoutType.Logging;
  @Input() layoutModel: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDefaultReady: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('layoutManager') layoutManager: ElementRef;
  private opened: boolean = false;
  private onSaving: EventEmitter<LayoutManagerModel> = new EventEmitter<LayoutManagerModel>();
  private onLoading: EventEmitter<LayoutManagerModel> = new EventEmitter<LayoutManagerModel>();
  private _layout: LayoutManagerModel;
  private modal: IMFXModalComponent;

  // private saveLayoutModalConfig = <ModalConfig>{
  //   componentContext: this,
  //   options: {
  //     modal: {
  //       size: 'sm',
  //       title: 'layout-manager.save',
  //       top: '47%',
  //       height: '50vh',
  //       isFooter: false,
  //     },
  //     content: {
  //       view: SaveLayoutModalComponent,
  //       options: {
  //         provider: <SaveLayoutModalProvider>null
  //       }
  //     }
  //   }
  // };

  // private loadLayoutModalConfig = <ModalConfig>{
  //   componentContext: this,
  //   options: {
  //     modal: {
  //       size: 'sm',
  //       title: 'layout-manager.open',
  //       top: '47%',
  //       height: '60vh',
  //       isFooter: false,
  //     },
  //     content: {
  //       view: LoadLayoutModalComponent,
  //       options: {
  //         provider: <LoadLayoutModalProvider>null
  //       }
  //     }
  //   }
  // };

  constructor(protected layoutService: LayoutManagerService,
              protected saveLayoutModalProvider: SaveLayoutModalProvider,
              protected loadLayoutModalProvider: LoadLayoutModalProvider,
              protected modalProvider: IMFXModalProvider) {

    // this.saveLayoutModalConfig.options.content.options.provider = saveLayoutModalProvider;
    // this.loadLayoutModalConfig.options.content.options.provider = loadLayoutModalProvider;

    this.onLoading.subscribe((res) => {
      this.loadLayoutHandler(res);
    });
    this.onSaving.subscribe((res) => {
      this.saveLayoutHandler(res);
    });
  }

  ngOnInit() {
    // this.saveLayoutModalProvider.saveLayoutModal = this.saveLayoutModal;
    // this.loadLayoutModalProvider.loadLayoutModal = this.loadLayoutModal;
    this._layout = <LayoutManagerModel> {
      'Id': 0,
      'Name': '',
      'IsShared': false,
      'IsDefault': false,
      'TypeId': this.layoutType,
      'Layout': '{}',
      'UserId': 0
    };
    switch (this.layoutType) {
      case LayoutType.Assess:
        this._layout.Layout = LayoutManagerDefaults.Assess;
        break;
      case LayoutType.Dashboard:
        this._layout.Layout = LayoutManagerDefaults.Dashboard;
        break;
      default:
        this._layout.Layout = LayoutManagerDefaults.Logging;
        break;
    }
    this.layoutService.getDefaultLayout(this.layoutType).subscribe((res) => {
      this.onDefaultReady.emit(res);
    });
  }

  open($event) {
    this.modal = this.modalProvider.show(LoadLayoutModalComponent, {
      size: 'sm',
      title: 'layout-manager.open',
      footer: false,
    });

    let content = this.modal.contentView.instance;
    content.toggleOverlay(true);
    content.setType(this.layoutType, this._layout, this.onLoading);

    this.opened = false;
  }

  save($event) {
    if (this.layoutModel) {
      this._layout = this.layoutModel;
    }

    this.modal = this.modalProvider.show(SaveLayoutModalComponent, {
      size: 'sm',
      title: 'layout-manager.save',
      footer: false,
    });

    let content = this.modal.contentView.instance;
    content.toggleOverlay(true);
    content.setData(this.layoutType, this._layout, false, this.onSave);

    this.opened = false;
  }

  saveAs($event) {
    if (this.layoutModel) {
      this._layout = this.layoutModel;
    }
    this._layout.Id = 0;
    this._layout.Name = '';
    this._layout.Name = '';

    this.modal = this.modalProvider.show(SaveLayoutModalComponent, {
      size: 'sm',
      title: 'layout-manager.save',
      footer: false,
    });

    let content = this.modal.contentView.instance;
    content.toggleOverlay(true);
    content.setData(this.layoutType, this._layout, false, this.onSave);

    this.opened = false;
  }

  saveGlobal($event) {
    if (this.layoutModel) {
      this._layout = this.layoutModel;
    }

    this.modal = this.modalProvider.show(SaveLayoutModalComponent, {
      size: 'sm',
      title: 'layout-manager.save',
      footer: false,
    });

    let content = this.modal.contentView.instance;
    content.toggleOverlay(true);
    content.setData(this.layoutType, this._layout, true, this.onSave);

    this.opened = false;
  }

  ngOnChanges() {
    if (this.layoutModel) {
      this._layout = this.layoutModel;
    }
  }

  reset($event) {
    let _layout = <LayoutManagerModel> {
      'Id': 0,
      'Name': '',
      'IsShared': false,
      'IsDefault': false,
      'TypeId': this.layoutType,
      'Layout': '{}',
      'UserId': 0
    };
    switch (this.layoutType) {
      case LayoutType.Assess:
        _layout.Layout = LayoutManagerDefaults.Assess;
        break;
      case LayoutType.Dashboard:
        _layout.Layout = LayoutManagerDefaults.Dashboard;
        break;
      default:
        _layout.Layout = LayoutManagerDefaults.Logging;
        break;
    }
    this._layout = _layout;
    this.changeLayout(_layout);
    this.opened = false;
  }

  toggleDropdown() {
    this.opened = !this.opened;
  }

  @HostListener('document:mousedown', ['$event'])
  onMousedown(event) {
    if (!this.layoutManager.nativeElement.contains(event.target)) {
      this.opened = false;
    }
  }

  private loadLayoutHandler(layout: LayoutManagerModel) {
    this._layout = layout;
    this.changeLayout(this._layout);
  }

  private saveLayoutHandler(layout: LayoutManagerModel) {
    this._layout = layout;
    this.onSave.emit(layout);
  }

  private changeLayout(layout: LayoutManagerModel) {
    this.onChange.emit(layout);
  }
}

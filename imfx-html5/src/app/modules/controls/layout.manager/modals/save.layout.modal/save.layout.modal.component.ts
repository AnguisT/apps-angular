import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Injector, OnInit,
  ViewEncapsulation
} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {Router} from "@angular/router";
import {SaveLayoutModalProvider} from "./save.layout.modal.provider";
import {LayoutManagerModel, LayoutType} from "../../models/layout.manager.model";
import {LayoutManagerService} from "../../services/layout.manager.service";

@Component({
  selector: 'save-layout-modal',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LayoutManagerService,
    SaveLayoutModalProvider
  ]
})

export class SaveLayoutModalComponent implements OnInit, AfterViewInit {

  private data: any;
  private showOverlay: boolean = false;
  private layoutName: string = "";
  private isShared: boolean = false;
  private isDefault: boolean = false;
  private changeEmitter: EventEmitter<LayoutManagerModel>;
  private layoutModel: LayoutManagerModel;

  constructor(private cdr: ChangeDetectorRef,
              private injector: Injector,
              private translate: TranslateService,
              private layoutService: LayoutManagerService,
              private saveLayoutProvider: SaveLayoutModalProvider,
              private router: Router) {
    this.router.events.subscribe(() => {
      this.closeModal();
    });

    this.saveLayoutProvider.moduleContext = this;

    // modal data
    this.data = this.injector.get('modalRef');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  setData(layoutType: LayoutType, layoutModel: LayoutManagerModel, isShared: boolean, changeEmitter: EventEmitter<LayoutManagerModel>) {
    this.changeEmitter = changeEmitter;
    this.layoutName = layoutModel.Name;
    this.isShared = isShared;
    this.isDefault = layoutModel.IsDefault;
    this.layoutModel = layoutModel;
    this.toggleOverlay(false);
  }

  saveLayout() {
    this.toggleOverlay(true);
    this.layoutModel.Name = this.layoutName;
    this.layoutModel.IsShared = this.isShared;
    this.layoutModel.IsDefault = this.isDefault;
    this.layoutModel.Layout = this.layoutModel.Layout;

    this.layoutService.saveLayout(this.layoutModel).subscribe((res) => {
      if(res) {
        this.layoutModel.Id = res['ID'];
        this.changeEmitter.emit(this.layoutModel);
      }
      this.closeModal();
    });
  }

  closeModal() {
    this.data.hide();
    this.showOverlay = false;
  }

  toggleOverlay(show) {
    this.showOverlay = show;
    this.cdr.detectChanges();
  }
}

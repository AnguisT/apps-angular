import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Injector, OnInit,
  ViewEncapsulation,
  TemplateRef,
  ViewChild
} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {Router} from "@angular/router";
import {SaveLayoutModalProvider} from "./save.layout.modal.provider";
import {LayoutManagerModel, LayoutType} from "../../models/layout.manager.model";
import {LayoutManagerService} from "../../services/layout.manager.service";
import {NewContactModalProvider} from "./new.contact.modal.provider";

@Component({
  selector: 'new-contact-modal',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NewContactModalProvider
  ]
})

export class NewContactModalComponent implements OnInit, AfterViewInit {

  private data: any;
  private showOverlay: boolean = false;
  private saveEmitter: EventEmitter<any>;
  @ViewChild('modalFooterTemplate', {read: TemplateRef}) modalFooterTemplate: TemplateRef<any>;

  constructor(private cdr: ChangeDetectorRef,
              private injector: Injector,
              private translate: TranslateService,
              private newContactProvider: NewContactModalProvider,
              private router: Router) {
    this.router.events.subscribe(() => {
      this.closeModal();
    });

    this.newContactProvider.moduleContext = this;

    // modal data
    this.data = this.injector.get('modalRef');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  setData() {
    this.toggleOverlay(false);
  }

  saveLayout() {
    this.toggleOverlay(true);
    this.saveEmitter.emit();
    this.closeModal();
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

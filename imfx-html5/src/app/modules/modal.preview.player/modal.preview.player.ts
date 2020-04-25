import {
  Component, ViewEncapsulation, ChangeDetectorRef, Injector, EventEmitter, ViewChild, Inject
} from '@angular/core';
import { NotificationService } from '../notification/services/notification.service';
import { TranslateService } from 'ng2-translate';
import { Router } from '@angular/router';
import { ModalPreviewPlayerProvider } from './providers/modal.preview.player.provider';
import { IMFXHtmlPlayerComponent } from '../controls/html.player/imfx.html.player';
import {MediaClip, RCEArraySource, RCESource} from '../../views/clip-editor/rce.component';
import { TimeCodeFormat, TMDTimecode } from '../../utils/tmd.timecode';
import {SimplePreviewPlayerComponent} from "../controls/simple.preview.player/simple.preview.player.component";

@Component({
  selector: 'imfx-modal-preview-player',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    './styles/index.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    // ControlToAdvTransfer,
  ],
  entryComponents: [
    IMFXHtmlPlayerComponent
  ]
})

export class ModalPreviewPlayerComponent {

    public onShow: EventEmitter<any> = new EventEmitter<any>();
    private data;
    private file: any;
    private src: any;

    @ViewChild('player') public playerWrapper: SimplePreviewPlayerComponent;
    private modalRef;

    constructor(private cdr: ChangeDetectorRef,
                private router: Router,
                private injector: Injector,
                private translate: TranslateService) {
        this.modalRef = this.injector.get('modalRef');
        this.data = this.modalRef.getData();
    }

    ngOnInit() {

        this.playerWrapper.srcs = [];
        if (this.data.clips.length > 0) {
            this.data.clips.map(el => {
                var start = TMDTimecode.fromString(
                    el.start,
                    TimeCodeFormat[this.data.file.TimecodeFormat]
                ).toSeconds() - TMDTimecode.fromString(
                    this.data.file.SOM_text,
                    TimeCodeFormat[this.data.file.TimecodeFormat]
                ).toSeconds();
                var end = TMDTimecode.fromString(
                    el.end,
                    TimeCodeFormat[this.data.file.TimecodeFormat]
                ).toSeconds() - TMDTimecode.fromString(
                    this.data.file.SOM_text,
                    TimeCodeFormat[this.data.file.TimecodeFormat]
                ).toSeconds();
                var src = this.data.src.filter(el2 => el2.id == el.mediaId)[0].src;

                this.playerWrapper.srcs.push(
                    {
                        "s": src,
                        "d": [start, end]
                    }
                )
            });
        }
        else {
            this.data.src.map(el => {
                this.playerWrapper.srcs.push(
                    {
                        "s": el.src,
                        "d": [0, el.seconds]
                    }
                )
            });
        }

        this.playerWrapper.updatePlayer();
        this.file = this.data.file;

        let clips = this.data.clips.map(clip => {
            let source: RCESource = this.data.src.filter(s => s.id === clip.mediaId)[0];
            if (source) {
                source.offsetStartAbsSec =
                    TMDTimecode.fromString(clip.start, TimeCodeFormat[this.file.TimecodeFormat])
                        .substract(TMDTimecode.fromString(
                            source.som_string,
                            TimeCodeFormat[this.file.TimecodeFormat])
                        ).toSeconds();
                source.seconds =
                    TMDTimecode.fromString(clip.end, TimeCodeFormat[this.file.TimecodeFormat])
                        .substract(TMDTimecode.fromString(
                            clip.start,
                            TimeCodeFormat[this.file.TimecodeFormat])
                        ).toSeconds();
                source.offsetEndAbsSec = source.offsetStartAbsSec + source.seconds;
            }
            return source;
        });
        this.src = clips;
    }

    closeModal() {
        this.modalRef.hide();
    }
}

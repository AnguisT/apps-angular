import {
  Component, Input, ViewEncapsulation, Output, EventEmitter, ChangeDetectorRef, ViewChild,
  ElementRef, Injectable
} from '@angular/core';
import * as $ from 'jquery';
import { Pipe, PipeTransform } from '@angular/core';
import { DetailService } from '../../../../../modules/search/detail/services/detail.service';
import {
  IMFXFrameSelectorComponent
} from './components/frame.selector.component/frame.selector.component';
import {
  MediaDetailMediaVideoResponse
} from '../../../../../models/media/detail/mediavideo/media.detail.mediavideo.response';
import { TMDTimecode } from '../../../../../utils/tmd.timecode';

@Component({
    selector: 'video-info',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        DetailService
    ]
})
@Injectable()
export class IMFXVideoInfoComponent {
  public config: any;
  compIsLoaded = false;

  @ViewChild('smudgeComp') smudgeComponent: IMFXFrameSelectorComponent;
  @ViewChild('sceneComp') sceneComponent: IMFXFrameSelectorComponent;
  @ViewChild('waveformComp') waveformComponent: IMFXFrameSelectorComponent;

  private smudge: VideoData;
  private scene: VideoData;
  private waveform: VideoData;

  constructor(private detailData: DetailService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
      let self = this;
      if (this.config.elem && !this.config.elem._config._isHidden) {
            this.detailData.getVideoInfo(this.config.file.ID, {
              smudge: true,
              scene: true,
              waveform: true
            }).subscribe(
              (resp: MediaDetailMediaVideoResponse) => {
                self.smudge = resp.Smudge;
                self.scene = resp.Scene;
                self.waveform = resp.AudioWaveform;
                self.compIsLoaded = true;
                self.cdr.detectChanges();
              }
            );
        }
  }

  setPercent(percent: number) {
    this.config.elem.emit('setPercent', percent);
  }

  setTimecode(tc: string) {
      ///*debugger*/
    this.config.elem.emit('setTimecode', tc);
  }

  setProgressByPercent(percent: number) {
    this.smudgeComponent && this.smudgeComponent.setProgressByPercent(percent);
    this.sceneComponent && this.sceneComponent.setProgressByPercent(percent);
    this.waveformComponent && this.waveformComponent.setProgressByPercent(percent);
  }

  setProgressByTimecode(tc: string) {
    if (this.smudgeComponent && !this.smudgeComponent.timecodeStringArray) {
      let duration = this.config.context.playerComponents.compRef.instance.player.duration();
      let frameDuration = duration / this.smudge.EventData.TotalFrames;
      let timecode = [];
      for (let i = 0; i < this.smudge.EventData.TotalFrames; i++) {
        let timecodeFromSeconds = TMDTimecode.secondsToString(i * frameDuration);
        timecode[i] = timecodeFromSeconds;
      }
      this.smudge.EventData.StringTimecodes = timecode;
      // this.smudgeComponent.timecodeStringArray = timecode;
    }
    this.smudgeComponent && this.smudgeComponent.setProgressByTimecode(tc);
    this.sceneComponent && this.sceneComponent.setProgressByTimecode(tc);
  }

  public loadComponentData() {
        if (!this.compIsLoaded){
           this.detailData.getVideoInfo(this.config.file.ID, {
              smudge: true,
              scene: true,
              waveform: true
            }).subscribe(
              (resp: MediaDetailMediaVideoResponse) => {
                this.smudge = resp.Smudge;
                this.scene = resp.Scene;
                this.waveform = resp.AudioWaveform;
                this.compIsLoaded = true;
                this.cdr.detectChanges();
              }
            );
        }
    }
}


export class VideoData {
  Url: string;
  EventData: {
    FrameHeight: number;
    FrameInterval: number;
    FrameWidth: number;
    MatrixWidth: number;
    StringTimecodes: Array<string>;
    TotalFrames: number;
  };
}

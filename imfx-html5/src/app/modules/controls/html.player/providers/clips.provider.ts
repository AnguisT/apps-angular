import { Output, Injectable, EventEmitter } from '@angular/core';
import {TMDTimecode, TimeCodeFormat} from "../../../../utils/tmd.timecode";
import {TimecodeProvider} from "./timecode.provider";
import {IMFXHtmlPlayerComponent} from "../imfx.html.player";
import {SegmentsProvider} from "./segments.provider";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

export interface ClipsProviderInterface {
    config: any;
    moduleContext: any;
    clipData: any;
    onAddClipFromPlayer: EventEmitter<any>;

    setInState();
    setOutState();
    doInitState();
    selectClipState();
    setIn();
    setOut();
    markframe();
    add();
    clear(clearAllPoints?);
    clearState();
    disableButton(el, disable);
    isNumeric(val);
    checkPoint(num);
    getCurrentClip();
    setProgressInterval();
    clearClipMarkers(clearAllPoints);
    clearClipPoints();
    addLastClipState();
    addNextClipState();
    selectClip(clip);
}
@Injectable()
export class ClipsProvider implements ClipsProviderInterface {
    clipData: any = {
        replaceIdx: -1,
        firstPointKey: null,
        firstPoint: {},
        secondPoint: {},
        clips: [],
        clipsUnlimited: true
    };
    moduleContext: IMFXHtmlPlayerComponent | any;
    config: any;
    @Output() onAddClipFromPlayer: EventEmitter<any> = new EventEmitter<any>();

    constructor(private timecodeProvider: TimecodeProvider,
                private segmentsProvider: SegmentsProvider){
        this.onAddClipFromPlayer.subscribe((resp)=>{
            switch (resp.id) {
                case 'markin':
                    this.setIn();
                    break;
                case 'markout':
                    this.setOut();
                    break;
                case 'markframe':
                    this.markframe();
                    break;
                case 'addclip':
                    this.add();
                    break;
                case 'replaceclip':
                    this.add(true);
                    break;
                case 'clearclip':
                    this.clear();
                    break;
                case 'gotoin':
                    this.goToIn();
                    break;
                case 'gotoout':
                    this.goToOut();
                    break;
                default: break;
            }
        });
        // setTimeout(()=>{
        //   this.initCanvasCleaner();
        // })
    }

    // bad idea - it fires too often

    // private initCanvasCleaner() {
    //   if (this.moduleContext instanceof IMFXHtmlPlayerComponent) {
    //     (<IMFXHtmlPlayerComponent>this.moduleContext).playerReady.subscribe(()=>{
    //       var canvas: HTMLCanvasElement = <HTMLCanvasElement>$("#clip-canvas")[0];
    //       if (canvas) {
    //         var context = canvas.getContext('2d');
    //         this.moduleContext.player.on("timeupdate", ()=>{
    //           context.clearRect(0, 0, canvas.width, canvas.height);
    //         })
    //       }
    //     })
    //   }
    // }

    setInState() {
        this.disableButton('markin', false);
        this.disableButton('markout', false);
        this.disableButton('markframe', false);
        this.disableButton('addclip', true);
        this.disableButton('replaceclip', true);
        this.disableButton('clearclip', false);
        this.disableButton('gotoin', false);
        this.disableButton('gotoout', true);
    }
    setOutState() {
        this.disableButton('markin', false);
        this.disableButton('markout', false);
        this.disableButton('addclip', false);
        this.disableButton('replaceclip', !(this.clipData.replaceIdx != -1));
        this.disableButton('clearclip', false);
        this.disableButton('gotoin', false);
        this.disableButton('gotoout', false);
    };
    doInitState() {
        this.disableButton('markin', false);
        this.disableButton('markout', true);
        this.disableButton('markframe', false);
        this.disableButton('addclip', true);
        this.disableButton('replaceclip', true);
        this.disableButton('clearclip', true);
        this.disableButton('gotoin', true);
        this.disableButton('gotoout', true);
    };
    selectClipState() {
        this.disableButton('markin', false);
        this.disableButton('markout', false);
        this.disableButton('addclip', true);
        this.disableButton('replaceclip', false);
        this.disableButton('clearclip', false);
        this.disableButton('gotoin', false);
        this.disableButton('gotoout', false);
    }
    disableAllMarkersButtons () {
        this.disableButton('markin', true);
        this.disableButton('markout', true);
        this.disableButton('markframe', true);
        this.disableButton('addclip', true);
        this.disableButton('replaceclip', true);
        this.disableButton('clearclip', true);
        this.disableButton('gotoin', true);
        this.disableButton('gotoout', true);
    }
    private hasFirstPoint() {
      return this.clipData.firstPoint && this.clipData.firstPoint.time
    }
    private hasSecondPoint() {
      return this.clipData.secondPoint && this.clipData.secondPoint.time
    }
    public setIn(ignorClear?: boolean) {
       // if( !this.isNumeric(time) ){
            let time = this.moduleContext.player.currentTime();
      //  }
        //for not possible to "Mark Out" before "Mark In"
        var markers = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
            return el.point == 2;
        })
        if (!ignorClear && (markers.length > 0 && markers[0].time < time)) {
            this.clear();
        }
        //----------------
        this.checkPoint(1);
        this.moduleContext.player.markers.add([{
            time: time,
            text: time,
            point: 1,
            class: 'in-marker'
        }]);
        this.clipData.firstPoint = {
            time: time,
            thumbnail: this.getCurrentClip()
        };
        this.clipData.firstPointKey = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
            return el.point == 1;
        })[0].key;
        this.setProgressInterval();

        this.hasSecondPoint() ? this.setOutState() : this.setInState();
        if (this.segmentsProvider.isSegmented() && !this.hasSecondPoint()) {
          let chunk = this.segmentsProvider.getSegmentByRelativeTimeSeconds(time);
          if (chunk) {
            this.setOut(this.moduleContext.player.duration() * chunk.percent);
            this.setOutState();
          }
        }
    };
    public setOut(outTime?) {
     //   if( !this.isNumeric(time) ){
        let time = outTime ||this.moduleContext.player.currentTime();
     //   }
        //for not possible to "Mark Out" before "Mark In"
        var markers = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
            return el.point == 1;
        })
      // if no first marker or second marker is smaller then first
        if (markers.length === 0 || (markers.length > 0 && markers[0].time > time)) {
            return;
        }
        //----------------
        this.checkPoint(2);
        this.moduleContext.player.markers.add([{
            time: time,
            text: time,
            point: 2,
            thumbnail: this.getCurrentClip(),
            class: 'out-marker'
        }]);

        this.clipData.secondPoint = {
            time: time,
            thumbnail: this.getCurrentClip()
        };
        this.setProgressInterval();
        this.setOutState();
    };

    public goToIn() {
      let marker = this.moduleContext.player.markers.getMarkers()[0];
      marker && this.moduleContext.player.currentTime(marker.time);
    }

    public goToOut() {
      let marker = this.moduleContext.player.markers.getMarkers()[1];
      marker && this.moduleContext.player.currentTime(marker.time);
    }
    public markframe () {
      this.setCurrentPointClip().subscribe((res) => {
        this.add();
      });
    }

    public add(replace: boolean = false) {
      // if first and second points exists
        if (Object.keys(this.clipData.firstPoint).length > 0 && Object.keys(this.clipData.secondPoint).length > 0) {
            let som = this.moduleContext.videoDetails.FileSomMs ? this.moduleContext.videoDetails.FileSomMs : 0;
            var newClip = {
                startTime: this.clipData.firstPoint.time,
                startThumbnail: this.clipData.firstPoint.thumbnail,
                startTimecodeString: this.timecodeProvider.getTimecodeString(this.clipData.firstPoint.time, TimeCodeFormat[this.moduleContext.videoDetails.TimecodeFormat], som),
                stopTime: this.clipData.secondPoint.time,
                stopThumbnail: this.clipData.secondPoint.thumbnail,
                stopTimecodeString: this.timecodeProvider.getTimecodeString(this.clipData.secondPoint.time, TimeCodeFormat[this.moduleContext.videoDetails.TimecodeFormat], som),
                itemID: this.moduleContext.file.ID
            };
            // this.clipData.clipsUnlimited ? this.addNextClipState() : this.addLastClipState();
            this.clear();
            if (replace) {
                this.moduleContext.clipReplaced.emit({
                    oldClipId: this.clipData.replaceIdx,
                    newClip: newClip
                });
            } else {
                this.moduleContext.clipAdded.emit(newClip);
            };
        }
    };
    public clear(clearAllPoints?: boolean) {
        this.clearClipMarkers(clearAllPoints);
        this.clearClipPoints();
        this.clearState();
    };
    clearState() {
        this.doInitState();
    }
    disableButton(el, disable){
        $('.' + el).attr('disabled', disable);
    };
    isNumeric(val) {
        // parseFloat NaNs numeric-cast false positives (null|true|false|"")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        // adding 1 corrects loss of precision from parseFloat (#15100)
        return !Array.isArray(val) && (val - parseFloat(val) + 1) >= 0;
    };
    checkPoint(num) {
        var markers = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
            return el.point == num;
        })
        if (markers.length > 0) {
            for (var i = 0; i < this.moduleContext.player.markers.getMarkers().length; i++) {
                if (this.moduleContext.player.markers.getMarkers()[i].point == num) {
                    this.moduleContext.player.markers.remove([i]);
                    break;
                }
            }
        }
    };
    getCurrentClip() {
      if (this.moduleContext.isLive) {
        return "./assets/img/audio-poster.PNG"
      } else {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>$("#clip-canvas")[0];//imfx-video-{{file.ID}}
        if(!canvas){
          return null;
        }
        var blankCanvas: HTMLCanvasElement = <HTMLCanvasElement>$("#empty-canvas")[0];//imfx-video-{{file.ID}}
        let id = this.moduleContext.id;
        // var video = $("#imfx-video-"+id+" video")[0];
        var video: HTMLVideoElement = <HTMLVideoElement>$("video")[0];
        var context = canvas.getContext('2d');
        debugger
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);

        if (this.moduleContext.player.src() == (document.location.origin + document.location.pathname)) {
          return "./assets/img/dpsinvert.png"
        } else {
          var url = "";
          try {
            url = canvas.toDataURL();
            let blank = blankCanvas.toDataURL();
            if (url == blank) {
              throw new Error("Video frame did not loaded yet, can not make a preview");
            }
          } catch (e) {
            console.error(e);
            url = "./assets/img/default-thumb.png"
          } finally {
            return url
          }
        }
      }
    };
    setProgressInterval() {
        if (!this.clipData.secondPoint) {
            //  alert('Select second point!');
            return;
        }
        if (!this.clipData.firstPoint) {
            //   alert('Select first point!');
            return;
        }
        if (this.clipData.secondPoint.time - this.clipData.firstPoint.time > 0 && this.clipData.firstPointKey) {
            var intervalWidth = (this.clipData.secondPoint.time - this.clipData.firstPoint.time) * 100 / this.moduleContext.player.duration();
            $('[data-marker-key="' + this.clipData.firstPointKey + '"]').css('width', intervalWidth + '%');
        }
    };
    clearClipMarkers(clearAllPoints: boolean = false) {
        if (!clearAllPoints) {
          // remove all except som and eom
          var arr = this.moduleContext.player.markers.getMarkers().filter(function(el){
            return el.point == 0;
          });
        }
        this.moduleContext.player.markers.removeAll();
        !clearAllPoints && this.moduleContext.player.markers.add(arr);
    };
    clearClipPoints() {
        this.clipData.firstPointKey = null;
        this.clipData.firstPoint = {};
        this.clipData.secondPoint = {};
    };
    // last of N available (from directive params)
    addLastClipState() {
        this.disableButton('markin', true);
        this.disableButton('markout', true);
        this.disableButton('addclip', true);
        this.disableButton('replaceclip', true);
        this.disableButton('clearclip', true);
        this.disableButton('gotoin', true);
        this.disableButton('gotoout', true);
    }
    // directive has no limit for clips
    addNextClipState() {
        this.doInitState();
    }
    clearNotClipMarkers(){
        var arr = this.moduleContext.player.markers.getMarkers().filter(function(el){
            return el.point > 0;
        });
        this.moduleContext.player.markers.removeAll();
        this.moduleContext.player.markers.add(arr);
    }
    selectClip(o){
        let markers = o.markers;
        this.clipData.replaceIdx = o.id;
        let timecodeFormat = TimeCodeFormat[this.moduleContext.videoDetails.TimecodeFormat];
        let som = this.moduleContext.videoDetails.Som || this.moduleContext.videoDetails.SOM_text;
        let clip = {
            startTime: TMDTimecode.fromString(markers[0].time, timecodeFormat).substract(TMDTimecode.fromString(som, timecodeFormat)).toSeconds(),
            stopTime: TMDTimecode.fromString(markers[1].time, timecodeFormat).substract(TMDTimecode.fromString(som, timecodeFormat)).toSeconds()
        }
        let arr = this.moduleContext.player.markers.getMarkers().filter(function(el){
            return el.point == 0;
        });
        this.moduleContext.player.markers.removeAll();
       // this.player.markers.add(arr);
        this.moduleContext.player.markers.add([{
            time: clip.startTime,
            text: clip.startTime,
            point: 1,
            class: 'in-marker'
        }]);
        this.clipData.firstPoint = {
            time: clip.startTime,
            thumbnail: markers[0].thumbnail
        };
        this.clipData.firstPointKey = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
            return el.point == 1;
        })[0].key;
        this.moduleContext.player.markers.add([{
            time: clip.stopTime,
            text: clip.stopTime,
            point: 2,
           // thumbnail: clip.stopThumbnail,
            class: 'out-marker'
        }]);
        this.clipData.secondPoint = {
            time: clip.stopTime,
           // thumbnail: clip.stopThumbnail
        };
        this.moduleContext.player.currentTime(this.moduleContext.player.markers.getMarkers()[0].time);
        this.setProgressInterval();
        this.selectClipState();
    }

    setCurrentPointClip(): Observable<Subscription> {
      return Observable.create((observer) => {
        let time = this.moduleContext.player.currentTime();
        this.clear();
        this.moduleContext.player.markers.add([{
          time: time,
          text: time,
          point: 1,
          class: 'in-marker'
        }]);
        this.clipData.firstPoint = {
          time: time,
          thumbnail: this.getCurrentClip()
        };
        this.clipData.firstPointKey = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
          return el.point == 1;
        })[0].key;
        this.moduleContext.player.markers.add([{
          time: time,
          text: time,
          point: 2,
          thumbnail: this.getCurrentClip(),
          class: 'out-marker'
        }]);

        this.clipData.secondPoint = {
          time: time,
          thumbnail: this.getCurrentClip()
        };
        observer.next(this.clipData);
      });
    }
    getCurrentPointClip(): Observable<Subscription> {
      return Observable.create((observer) => {
        this.setCurrentPointClip().subscribe((res) => {
          let som = this.moduleContext.videoDetails.FileSomMs ? this.moduleContext.videoDetails.FileSomMs : 0;
          var newClip = {
            startTime: this.clipData.firstPoint.time,
            startThumbnail: this.clipData.firstPoint.thumbnail,
            startTimecodeString: this.timecodeProvider.getTimecodeString(this.clipData.firstPoint.time, TimeCodeFormat[this.moduleContext.videoDetails.TimecodeFormat], som),
            stopTime: this.clipData.secondPoint.time,
            stopThumbnail: this.clipData.secondPoint.thumbnail,
            stopTimecodeString: this.timecodeProvider.getTimecodeString(this.clipData.secondPoint.time, TimeCodeFormat[this.moduleContext.videoDetails.TimecodeFormat], som),
            itemID: this.moduleContext.file.ID
          };
          observer.next(newClip);
        });
      });
    }
    getInOutPoint(data): Observable<Subscription> {
      return Observable.create((observer) => {
          if (data.type == 'In') {
            this.setIn(true);
            var point = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
              return el.point === 1;
            })[0];
          }
          else {
            this.setOut();
            var point = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
              return el.point === 2;
            })[0];
          }
          let som = this.moduleContext.videoDetails.FileSomMs ? this.moduleContext.videoDetails.FileSomMs : 0;
          let timecodeFormat = TimeCodeFormat[this.moduleContext.videoDetails.TimecodeFormat];
          let timecode = this.timecodeProvider.getTimecodeString(point.time, timecodeFormat, som);
          let duration = this.getDuration();
          observer.next({type: data.type, timecode: timecode, duration: duration});
      });
    }
    getDuration() {
      let som = this.moduleContext.videoDetails.FileSomMs ? this.moduleContext.videoDetails.FileSomMs : 0;
      let timecodeFormat = TimeCodeFormat[this.moduleContext.videoDetails.TimecodeFormat];
      let _in = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
        return el.point === 1;
      })[0]
      let _out = this.moduleContext.player.markers.getMarkers().filter(function (el, ind) {
        return el.point === 2;
      })[0]
      let inTimecode = "00:00:00:00";
      let outTimecode = "00:00:00:00";
      if (!!_in) {
        inTimecode = this.timecodeProvider.getTimecodeString(_in.time, timecodeFormat, som);
      }
      if (!!_out) {
        outTimecode = this.timecodeProvider.getTimecodeString(_out.time, timecodeFormat, som);
      }
      let duration = TMDTimecode.fromString(outTimecode, timecodeFormat).substract(TMDTimecode.fromString(inTimecode, timecodeFormat));
      return duration;
    }
}

import {
    Component, ViewChild, Input, Output, EventEmitter, ViewEncapsulation,
    ChangeDetectionStrategy, ChangeDetectorRef, ElementRef
} from '@angular/core';

require('./plugins/html5slider');

@Component({
  selector: 'simple-preview-player',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class SimplePreviewPlayerComponent {

    @Input("srcs") public srcs: Array<any> = [
        // {s:'http://localhost:3000/assets/mock-data/1.1.Course Overview.mp4',d:[10, 30]},
        // {s:'http://localhost:3000/assets/mock-data/4 - UV.mp4',d:[35, 55]},
        // {s:'http://localhost:3000/assets/mock-data/1.1.Course Overview.mp4',d:[30, 60]},
        // {s:'http://localhost:3000/assets/mock-data/4 - UV.mp4',d:[55, 85]}
    ];
    // private srcs = [
    //     {s:'http://192.168.90.39/proxy_testing/dne space h264.mov',d:[0, 30]},
    //     {s:'http://192.168.90.39/proxy_testing/666~tHD_ONPOINT_1.mov',d:[35, 95]},
    //     {s:'http://192.168.90.39/proxy_testing/dne space h264.mov',d:[35, 50]}
    //     // {s:'http://localhost:3000/assets/mock-data/1.1.Course Overview.mp4',d:[10, 30]},
    //     // {s:'http://localhost:3000/assets/mock-data/4 - UV.mp4',d:[35, 55]},
    //     // {s:'http://localhost:3000/assets/mock-data/1.1.Course Overview.mp4',d:[30, 60]},
    //     // {s:'http://localhost:3000/assets/mock-data/4 - UV.mp4',d:[55, 85]}
    //     ];
    @ViewChild("previewPlayerWrapper") private previewPlayerWrapper: ElementRef;
    @ViewChild("timelineArea") private timelineArea: ElementRef;
    @ViewChild("timelineFill") private timelineFill: ElementRef;
    @ViewChild("timelineSeek") private timelineSeek: ElementRef;
    private players = [];
    private currentIndex = 0;
    private currentTime = 0;
    private totalDuration = 0;
    private readyCounter = 0;
    private seek = false;

    public cleanPlayers() {
        for(var i = 0; i < this.players.length; i++) {
            this.players[i].get(0).pause();
            this.players[i].remove();
        }
        this.players = [];
        this.currentIndex = 0;
        this.currentTime = 0;
        this.totalDuration = 0;
        this.readyCounter = 0;
        this.seek = false;
        $(this.timelineSeek.nativeElement).val(0);
        $(this.timelineSeek.nativeElement).attr("value", 0);
        $(this.timelineFill.nativeElement).attr("style", "width:"+0+"%");
        $(".tl-file-buf").remove();
        $(".tl-file-end").remove();
    }

    public updatePlayer() {
        this.cleanPlayers();
        for(var i = 0; i < this.srcs.length; i++) {
            var newPlayer = $('<video muted preload srcindex="'+i+'" src="' + this.srcs[i].s + '#t='+this.srcs[i].d[0]+','+ this.srcs[i].d[1]+'"></video>');
            this.players.push(newPlayer);
            this.totalDuration += this.srcs[i].d[1] - this.srcs[i].d[0];
            $(this.previewPlayerWrapper.nativeElement).append(this.players[i]);
            if(i == 0) {
                $(this.players[i]).attr("style","z-index: 1");
            }
            else {
                $(this.players[i]).attr("style","z-index: -1");
            }

            $(this.players[i]).on('timeupdate', (e) => {
                this.togglePlayer();
            })

            // this.players[i].get(0).oncanplay = (e) => {
            //     this.readyCounter++;
            // };

            // $(this.players[i]).on('progress', (e) => {
            //     this.bufferUpdate(e);
            // })
        }
        $(this.timelineSeek.nativeElement).attr("max", this.totalDuration);
        $(this.timelineSeek.nativeElement).val(0);
        $(this.timelineSeek.nativeElement).attr("value", 0);
        var prevDuration = 0;
        for(var i = 0; i < this.srcs.length; i++) {
            if(i < this.srcs.length - 1) {
                var buf = $('<div class="tl-file-buf" id="buffered-amount-'+i+'" style="left:'+prevDuration+'%"></div>');
                $(this.timelineArea.nativeElement).append(buf);
                var left = prevDuration + (this.srcs[i].d[1] - this.srcs[i].d[0])/this.totalDuration * 100;
                prevDuration = left;
                var sep = $('<div class="tl-file-end" style="left:'+left+'%"></div>');
                $(this.timelineArea.nativeElement).append(sep);


            }
        }
    }

    bufferUpdate(e) {
        var player = e.currentTarget;
        var index = parseInt(player.getAttribute('srcindex'));
        var duration =  this.srcs[index].d[1] - this.srcs[index].d[0];
        for (var i = 0; i < player.buffered.length; i++) {
            if (player.buffered.start(player.buffered.length - 1 - i) < player.currentTime) {
                document.getElementById("buffered-amount-" + index).style.width = (player.buffered.end(player.buffered.length - 1 - i) / duration) * 100 + "%";
                break;
            }
        }
    }

    processTime() {
        var curDuration = 0;
        var curDurationPercent = 0;
        for(var i = 0; i <= this.currentIndex; i++) {
            if(i < this.currentIndex) {
                var leftPercent = curDurationPercent + (this.srcs[i].d[1] - this.srcs[i].d[0])/this.totalDuration * 100;
                var d = curDuration + (this.srcs[i].d[1] - this.srcs[i].d[0]);
            }
           else {
                var leftPercent = curDurationPercent + (this.players[this.currentIndex].get(0).currentTime - this.srcs[i].d[0] )/this.totalDuration * 100;
                var d = curDuration + (this.players[this.currentIndex].get(0).currentTime - this.srcs[i].d[0] );
            }
            curDurationPercent = leftPercent;
            curDuration = d;
        }
        if(!this.seek) {
            $(this.timelineSeek.nativeElement).val(curDuration);
            $(this.timelineSeek.nativeElement).attr("value", curDuration);
        }
        $(this.timelineFill.nativeElement).attr("style", "width:"+curDurationPercent+"%");
    }

    togglePlayer() {
        if(this.players[this.currentIndex].get(0).currentTime >= this.srcs[this.currentIndex].d[1]) {
            $(this.players[this.currentIndex]).attr("style","z-index: -1");
            this.players[this.currentIndex].get(0).muted = true;
            this.pause();
            if(this.currentIndex < this.srcs.length - 1) {
                this.currentIndex++;
                this.players[this.currentIndex].get(0).currentTime = this.srcs[this.currentIndex].d[0];
                this.play(true);
            }
        }
        this.processTime();
    }
    freezeChange(e) {
        this.seek = true;
    }
    onClickRange(e) {
        this.currentTime = $(this.timelineSeek.nativeElement).val();
        var dur = 0;
        for(var i = 0; i < this.srcs.length; i++) {
            var d = dur + (this.srcs[i].d[1] - this.srcs[i].d[0]);
            if(d >= this.currentTime && this.currentTime >= dur) {
                if(this.currentIndex == i) {
                    this.players[this.currentIndex].get(0).currentTime = this.srcs[i].d[0] + (this.currentTime - dur);
                }
                else {
                    this.players[this.currentIndex].get(0).muted = true;
                    this.players[this.currentIndex].get(0).pause();
                    $(this.players[this.currentIndex]).attr("style","z-index: -1");
                    this.currentIndex = i;
                    this.players[this.currentIndex].get(0).currentTime = this.srcs[i].d[0] + (this.currentTime - dur);
                    this.players[this.currentIndex].get(0).muted = false;
                    this.players[this.currentIndex].get(0).play();
                    $(this.players[this.currentIndex]).attr("style","z-index: 1");
                }
                break;
            }
            dur = d;
        }
        this.seek = false;
    }

    play(fromToggle = false) {
        if(!fromToggle) {
            $(this.players[this.currentIndex]).attr("style","z-index: 1");
            this.players[this.currentIndex].get(0).muted = false;
            this.players[this.currentIndex].get(0).play();
        }
        else {
            this.players[this.currentIndex].get(0).currentTime = this.srcs[this.currentIndex].d[0];
            this.players[this.currentIndex].get(0).muted = false;
            this.players[this.currentIndex].get(0).play();
            $(this.players[this.currentIndex]).attr("style","z-index: 1");
        }
    }

    pause() {
        this.players[this.currentIndex].get(0).pause();
    }

    restart() {
        this.players[this.currentIndex].get(0).muted = true;
        this.players[this.currentIndex].get(0).pause();
        $(this.players[this.currentIndex]).attr("style","z-index: -1");
        this.currentIndex = 0;
        this.players[this.currentIndex].get(0).currentTime = this.srcs[this.currentIndex].d[0];
        this.players[this.currentIndex].get(0).muted = false;
        this.players[this.currentIndex].get(0).play();
        $(this.players[this.currentIndex]).attr("style","z-index: 1");
    }
}

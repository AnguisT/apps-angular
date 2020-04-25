function getPlaybackRate(num) {
    return {
        "-4": 0.1,
        "-3": 0.2,
        "-2": 0.4,
        "-1": 0.5,
        // "-4": -16,
        // "-3": -8,
        // "-2": -4,
        // "-1": -2,
        "0": 1,
        "1": 2,
        "2": 4,
        "3": 8,
        "4": 16
    }[num]
}

function setPlaybackRate(player, rate) {
  player.playbackRate(rate);
  if (player.waveform && player.waveform.surfer && player.waveform.surfer.backend) {
    player.waveform.surfer.backend.playbackRate = rate;
    player.waveform.surfer.backend.seekTo(player.currentTime() );
    player.waveform.surfer.backend.play();
    player.waveform.surfer.drawer.progress(player.waveform.surfer.backend.getPlayedPercents());
  }
}

var VjsButton = videojs.getComponent('Button');
var FBFButton = videojs.extend(VjsButton, {
    constructor: function (player, options) {
        VjsButton.call(this, player, options);
        this.player = player;
        this.getFrameTime = function () {
            return 1 / options.getFps()
        };
        this.step_size = options.value;
        this.on('click', this.onClick);
    },
    onClick: function () {
        // Start by pausing the player
        this.player.pause();
        this.player.addClass('vjs-has-started');
        // Calculate movement distance
        if (this.step_size == 'start') {
            this.player.currentTime(0);
            return;
        }
        else if (this.step_size == 'end') {
            this.player.currentTime(this.player.duration());
            return;
        }
        var dist;
        if (this.step_size == 'second-backward') {
            this.player.currentTime(this.player.currentTime() - 1)
        }
        else if (this.step_size == 'second-forward') {
            this.player.currentTime(this.player.currentTime() + 1)
        }
        else {
            dist = this.getFrameTime() * this.step_size;
            this.player.currentTime(this.player.currentTime() + dist);
        }
    },
});

function playbackSlider(options) {
    var player = this;
    var nativePlayer = $(player.el()).find("video")[0];
    player.ready(function () {
        if(!options){ //reset slider
            $(".playback-slider-container").slider("value", 0);
            $(player.el()).removeClass("vjs-rewind");
            clearInterval(player.rewindInterval);
        }
        else {
            if (!player.controlBar.getChildById('sub_control_bar').getChildById('center_control_bar')) {
                player.controlBar.getChildById('sub_control_bar').addChild('component', {
                    text: "",
                    id: "center_control_bar"
                }).addClass('sub-control-bar').setAttribute('id', 'center_control_bar');
            }
            var _divF1 = player.controlBar.getChildById('sub_control_bar').getChildById('center_control_bar').addChild('component', {
                text: "",
                id: "fbfbox"
            }).addClass("fbf-block");
            options.stepsBack.forEach(function (opt) {
                _divF1.addChild(new FBFButton(player, {
                    el: videojs.createEl('div', {
                        className: 'vjs-res-button icon-button',
                        innerHTML: '<i class="icons-' + opt.icon + ' icon"></i>',
                        title: opt.text
                    }, {
                        role: 'button'
                    }),
                    value: opt.step,
                    getFps: options.getFps,
                }), {}, opt.index);
            });
            player.rewindInterval;
            var _div = player.controlBar.getChildById('sub_control_bar').getChildById('center_control_bar').addChild('component', {
                text: "",
                id: "playback-slider-box"
            }).addClass("playback-slider-block").addChild('component', {
                text: ""
            }).addClass("playback-slider-container");
            // $(".playback-slider-container").width(300);
            var $sliderEl = $(".playback-slider-container").slider({
                value: 0,
                min: -4,
                max: 4,
                step: 1,
                slide: function (event, ui) {
                    var rate = getPlaybackRate(ui.value);
                    if (rate > 0) {
                        $(player.el()).removeClass("vjs-rewind");
                        clearInterval(player.rewindInterval);
                        setPlaybackRate(player, rate)
                    }
                    else {
                        $(player.el()).addClass("vjs-rewind"); // hide loading spinner
                        clearInterval(player.rewindInterval);
                        nativePlayer.pause();
                        player.rewindInterval = setInterval(function () {
                            // player.currentTime(player.currentTime()+rate/100);
                            // if (!nativePlayer.paused) {
                              nativePlayer.currentTime += rate / 25;
                              // nativePlayer.currentTime -= 0.1;
                            // }
                            if (nativePlayer.currentTime == 0) {
                              nativePlayer.pause();
                              clearInterval(player.rewindInterval);
                            }
                        }, 1 / 25)
                    }
                },
                change: function (event, ui) {
                    // clearInterval(rewindInterval);
                    // if (ui.value != 0) {
                    // $(".playback-slider-container").slider('value',0);
                    // setPlaybackRate(player, getPlaybackRate(0))
                    // player.play();
                    // }
                }
            }).each(function () {
                var opt = $(this).data().uiSlider.options;
                // Get the number of possible values
                var vals = opt.max - opt.min;
                // Space out values
                for (var i = 0; i <= vals; i += opt.step) {
                    var rate = getPlaybackRate(i + opt.min);
                    var el = $('<label>' + (rate) + '</label>').css('left', (i / vals * 100) + '%');
                    $(this).append(el);
                }
            });
            player.on('ratechange', function() { //TODO: be careful with getPlaybackRate()
              if (this.player.waveform && this.player.waveform.surfer && this.player.waveform.surfer.backend) {
                this.player.waveform.surfer.backend.playbackRate = player.playbackRate();
              }
            });
            player.on('seeked', function(){
              var rate = getPlaybackRate($sliderEl.slider('value'));
              if (rate > 0) {
                setPlaybackRate(player, rate);
              }
            });
            player.on('play', function(){
              var rate = getPlaybackRate($sliderEl.slider('value'));
              if (rate <0) {
                $sliderEl.slider('value', 0);
                setPlaybackRate(player, getPlaybackRate(0));
                clearInterval(player.rewindInterval);
                $(player.el()).removeClass("vjs-rewind");
              }
            });
            var _divF2 = player.controlBar.getChildById('sub_control_bar').getChildById('center_control_bar').addChild('component', {
                text: "",
                id: "fbfbox"
            }).addClass("fbf-block");
            options.stepsForward.forEach(function (opt) {
                _divF2.addChild(new FBFButton(player, {
                    el: videojs.createEl('div', {
                        className: 'vjs-res-button icon-button',
                        innerHTML: '<i class="icons-' + opt.icon + ' icon"></i>',
                        title: opt.text
                    }, {
                        role: 'button'
                    }),
                    value: opt.step,
                    getFps: options.getFps,
                }), {}, opt.index);
            });
        }
    });
}
videojs.plugin('playbackSlider', playbackSlider);

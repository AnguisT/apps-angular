var VjsAudiotrackButton = videojs.getComponent('AudioTrackButton');
var audiotrackButton = videojs.extend(VjsAudiotrackButton, {
    constructor: function (player, options, callback) {
        VjsAudiotrackButton.call(this, player, options);
        this.player = player;
    }
});

videojs.plugin('audiotrackbutton', function (options) {
    var player = this;
    player.ready(function () {
        var _div = player.controlBar.getChildById('sub_control_bar').getChildById('right_control_bar').addChild(new audiotrackButton(player, {
            el: videojs.createEl("div", {
                className: 'vjs-audio-button vjs-menu-button vjs-menu-button-popup vjs-button icon-button vjs-custom-audio-button',
                innerHTML: '<i class="icons-audio-select icon"></i>',
                title: options.title
            })
        }));
    });
});

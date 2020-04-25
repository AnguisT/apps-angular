var VjsButton = videojs.getComponent('PlayToggle');
var playButton = videojs.extend(VjsButton, {
    constructor: function(player, options) {
        VjsButton.call(this, player, options);
        this.player = player;
        this.controlTextEl_ = videojs.createEl('span', {
            className: 'vjs-control-text',
            innerHTML: '<span></span>'
        })
    },
    handlePlay: function(event) {
        this.removeClass('vjs-paused');
        this.addClass('vjs-playing');
        // change the button text to "Pause"
        this.controlText(this.options().pluginOptions.pauseTitle);
    },
    handlePause: function(event) {
        this.removeClass('vjs-playing');
        this.addClass('vjs-paused');
        // change the button text to "Play"
        this.controlText(this.options().pluginOptions.playTitle);
    }
});

videojs.plugin('playbutton', function (options) {
     var player = this;
     player.ready(function () {
         if (!player.controlBar.getChildById('sub_control_bar').getChildById('left_control_bar')){
             player.controlBar.getChildById('sub_control_bar').addChild(
                 'component', {
                     text: "",
                     id:"left_control_bar"
                 }).addClass('sub-control-bar').setAttribute('id','left_control_bar');
         }
        player.controlBar.getChildById('sub_control_bar').getChildById('left_control_bar').addChild(
            new playButton(player, {
                el: videojs.createEl(
                    "div",
                    {
                        className: 'icon-button vjs-play-pause-button',
                        innerHTML: '<i class="icons-play icon play"></i><i class="icons-pause icon pause"></i>',
                        title: options.playTitle
                    }
                ),
                pluginOptions: options
            }));
    });
});

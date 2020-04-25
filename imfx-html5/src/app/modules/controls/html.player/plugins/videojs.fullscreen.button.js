var VjsButton = videojs.getComponent('FullscreenToggle');
var fullscreenButton = videojs.extend(VjsButton, {
    constructor: function (player, options, callback) {
        VjsButton.call(this, player, options);
        this.player = player;
        this.controlTextEl_ = videojs.createEl('span', {
            className: 'vjs-control-text',
            innerHTML: '<span></span>'
        });
        this.on(player, 'fullscreenchange', this.handleFullscreenChange);
    },
    handleFullscreenChange: function(e){
        var videoHeight = $(e.target).height();
        var controlBarHeight = $(e.target).find('.vjs-control-bar').height();
        $(e.target).find('video.vjs-tech').height(videoHeight-controlBarHeight);
        if (this.player_.isFullscreen()) {
            this.controlText(this.options().pluginOptions.nonFullscreenTitle);
            $('#cinema-mode').hide();
            // for displaing overlay in the fullscreen mode
            $(this.player.el()).append($('#png-overlay'));
        } else {
            this.controlText(this.options().pluginOptions.fullscreenTitle);
            $('#cinema-mode').show();
            $(this.player.el().parentElement).append($('#png-overlay'));
        }
    }
});
videojs.plugin('fullscreenbutton', function (options) {
    var player = this;
    player.ready(function () {
        if (!player.controlBar.getChildById('sub_control_bar').getChildById('right_control_bar')) {
            player.controlBar.getChildById('sub_control_bar').addChild('component', {
                text: "",
                id: "right_control_bar"
            }).addClass('sub-control-bar').setAttribute('id', 'right_control_bar');
        }
        player.controlBar.getChildById('sub_control_bar').getChildById('right_control_bar').addChild(new fullscreenButton(player, {
            el: videojs.createEl("div", {
                className: 'icon-button',
                id: 'fullscreen-btn',
                innerHTML: '<i class="icons-fullscreen icon"></i><i class="icons-exit-fullscreen icon"></i>',
                title: options.fullscreenTitle
            }),
            pluginOptions : options
        }));
    });
});

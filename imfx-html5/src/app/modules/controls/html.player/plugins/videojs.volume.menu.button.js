var VjsButton = videojs.getComponent('VolumeMenuButton');
var volumeButton = videojs.extend(VjsButton, {
    constructor: function(player, options, callback) {
      VjsButton.call(this, player, options);
      this.player = player;
      this.controlTextEl_ = videojs.createEl('span', {
        className: 'vjs-control-text',
        innerHTML: '<span></span>'
      })
    }
    // },
    // handleClick: function(event) {
    //   this.player.muted(!this.player.muted());
    // },
    // volumeUpdate: function() {
    //   if(this.player.componentContext.audioSrc && this.player.componentContext.audioPlayer) {
    //     this.player.componentContext.audioPlayer.volume = this.player.volume();
    //     this.player.muted(true);
    //   }
    // }
});

videojs.plugin('volumemenubutton', function (options) {
     var player = this;
     player.ready(function () {
        player.controlBar.getChildById('sub_control_bar').getChildById('left_control_bar').addChild(
            new volumeButton(player, {
                el: videojs.createEl(
                    "div",
                    {
                        className: 'icon-button vjs-volume-menu-button vjs-menu-button vjs-menu-button-popup vjs-button vjs-volume-menu-button-vertical vjs-vol-3',
                        innerHTML: '<i class="icons-volume-high icon volume-high"></i><i class="icons-volume-low icon volume-low"></i><i class="icons-volume-mute icon volume-mute"></i>',
                        title: 'Mute'
                    }
                ),
                inline: false,
                vertical: true
            }));
    });
});

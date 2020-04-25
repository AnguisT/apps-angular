var VjsSubtitlesButton = videojs.getComponent('SubtitlesButton');
var subtitlesButton = videojs.extend(VjsSubtitlesButton, {
    constructor: function (player, options, callback) {
      VjsSubtitlesButton.call(this, player, options);
        this.player = player;
    },
   /* createItems: function () {
        for (var i = 0; i < this.options_.playerOptions.btns.length; i++) {
            var opt = this.options_.playerOptions.btns[i];
            var btn = this.addChild(new captionButton(this.player_, {
                el: videojs.createEl("li", {
                    className: 'vjs-menu-item',
                    innerHTML: opt.text,
                    id: opt.id
                })
            }, {
                onClick: opt.onClick
            }), {})
        }
        return this.children_;
    }*/
});
videojs.plugin('subtitlesbutton', function (options) {
    var player = this;
    player.ready(function () {
        var _div = player.controlBar.getChildById('sub_control_bar').getChildById('right_control_bar').addChild(new subtitlesButton(player, {
            el: videojs.createEl("div", {
                className: 'vjs-menu-button vjs-menu-button-popup icon-button vjs-custom-captions-button',
                innerHTML: '<i class="icons-subtitles icon"></i>',
                title: options.title
            }),
            playerOptions: options
        }))//.addClass("captions-button");
       /* var btn = _div.addChild(new captionsButton(player, {
            el: videojs.createEl("button", {
                className: 'vjs-menu-button vjs-menu-button-popup icon-button vjs-custom-captions-button',
                innerHTML: '<svg class="icon"><use xlink:href="assets/icons/svg-symbols.svg#subtitles"></use></svg>',
            }),
            playerOptions: options
        }), {});*/
       setTimeout(function(){
         var textTracksMenuItems = $('.vjs-custom-captions-button .vjs-menu-item');
         var len = textTracksMenuItems.length;
         for ( var i = 0; i < len; i++ ) {
           if( textTracksMenuItems[i].innerHTML.toLocaleLowerCase().indexOf("subtitles off") > -1 ) {
             $(textTracksMenuItems[i]).html(textTracksMenuItems[i].innerHTML.replace("subtitles off", options.titleCCOff));
           }
         }
       });
    });
});

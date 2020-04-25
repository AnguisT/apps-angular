var VjsButton = videojs.getComponent('BigPlayButton');
var playerComp;
var bigPlayButton = videojs.extend(VjsButton, {
    constructor: function(player, options, callback) {
        VjsButton.call(this, player, options);
        playerComp = player;
    },
    handleClick: function(player) {
        playerComp.play();
        player.stopPropagation();
    }
});

videojs.plugin('bigplaybutton', function (options) {
    var player = this;
    player.ready(function () {
        player.addChild(
            new bigPlayButton(player, {
                el: videojs.createEl(
                    "div",
                    {
                        className: 'imfx-big-play-btn',
                        innerHTML: '<button class="icon-button large"><i class="icons-play icon"></i></button>',
                        title: options.title
                    }
                )
            }));
    });
});

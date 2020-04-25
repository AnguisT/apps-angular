var VjsButton = videojs.getComponent('Button');
var cinemaModeButton = videojs.extend(VjsButton, {
  constructor: function(player, options, callback) {
    VjsButton.call(this, player, options);
    this.player = player;
    this.controlTextEl_ = videojs.createEl('span', {
      className: 'vjs-control-text',
      innerHTML: '<span></span>'
    });
    $(this.el()).find('.icon-non-cinema-mode').hide();
    this.on('click', this.onClick, options);
    if( this.player.cinemaMode ) {
      $(this.el()).find('.icon-non-cinema-mode').show();
      $(this.el()).find('.icon-cinema-mode').hide();
      this.controlText(options.nonCinemaModeTitle);
    }
    else {
        $(this.el()).find('.icon-non-cinema-mode').hide();
        $(this.el()).find('.icon-cinema-mode').show();
        this.controlText(options.cinemaModeTitle);
    }
  },
  onClick: function() {
    var options = this.options().pluginOptions;
    var paused = this.player.paused();
    if( !this.player.cinemaMode ) {
      // remove from old position and add into new
      $(options.videoContainerWrapper).css('opacity', 0);
      $(options.cinemaModePlayerWrapper).prepend($(options.videoContainerWrapper));
      setTimeout(function(){
        $(options.videoContainerWrapper).css('opacity', 1);
      });
      $(options.neighboringContainerWrapper).addClass('simplified-blocks-wrapper-with-cinema-player');
      this.player.cinemaMode = true;
      $(this.el()).find('.icon-non-cinema-mode').show();
      $(this.el()).find('.icon-cinema-mode').hide();
      this.controlText(options.nonCinemaModeTitle);
    }
    else {
      if(this.player_.isFullscreen()){
        this.player.exitFullscreen();
      }
      else {
        $(options.videoContainerWrapper).css('opacity', 0);
        $(options.simpleModePlayerWrapper).prepend($(options.videoContainerWrapper));
        setTimeout(function(){
          $(options.videoContainerWrapper).css('opacity', 1);
        });
        $(options.neighboringContainerWrapper).removeClass('simplified-blocks-wrapper-with-cinema-player');
        this.player.cinemaMode = false;
        $(this.el()).find('.icon-non-cinema-mode').hide();
        $(this.el()).find('.icon-cinema-mode').show();
        this.controlText(options.cinemaModeTitle);
      }
    }
    if( !paused ) {
      this.player.play();
    }
  }
});
videojs.plugin('cinemamodebutton', function (options) {
  var player = this;
  player.ready(function () {
    if (!player.controlBar.getChildById('sub_control_bar').getChildById('right_control_bar')) {
      player.controlBar.getChildById('sub_control_bar').addChild('component', {
        text: "",
        id: "right_control_bar"
      }).addClass('sub-control-bar').setAttribute('id', 'right_control_bar');
    };
    player.controlBar.getChildById('sub_control_bar').getChildById('right_control_bar').addChild(new cinemaModeButton(player, {
      el: videojs.createEl("div", {
        className: 'icon-button',
        id: 'cinema-mode',
        innerHTML: '<i class="fa fa-square-o icon-cinema-mode"></i><i class="fa fa-square-o icon-non-cinema-mode"></i>',
        title: options.cinemaModeTitle
      }),
      pluginOptions : options
    }));
    $('#cinema-mode').insertBefore($('#fullscreen-btn'));
  });
});

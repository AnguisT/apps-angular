var VjsOverlayButton = videojs.getComponent('MenuButton');
var overlayButton = videojs.extend(VjsOverlayButton, {
  constructor: function (player, options, callback) {
    VjsOverlayButton.call(this, player, options);
    this.player = player;
    this.player.overlay = this;
  },
  createItems: function() {
    var screenResolution = [
      { text: "Overlay Off", url : '' },
      { text: "Pillarbox", url : "url('assets/img/player-overlays/pillarbox.png')" },
      { text: "16 : 9", url : "url('assets/img/player-overlays/16-9.png')" },
      { text: "4 : 3", url : "url('assets/img/player-overlays/center-cut-safe1.png')" }
      ]
    var ComponentClass = videojs.getComponent('Component').getComponent('MenuItem');
    var items = [];
    for (var i = 0; i < screenResolution.length; i++){
      var component = new ComponentClass(this.player_ || this, {name: "MenuItem", id: 'video-overlay-'+i});
      component.selectable = true;
      if(i == 0) {
        component.selected(true);
      }
      component.el_.innerText = screenResolution[i].text;
      component._backgroundUrl = screenResolution[i].url;
      component.on('click', function(event){
        var _this = this;
        var items = this.player().overlay.items;
        $('.png-overlay').css('background-image', this._backgroundUrl);
        items.forEach(function(el){
          if (el.id_ !== _this.id_){
            el.selected(false);
          }
        })
      })
      items.push(component);
    }
    return items;
  }
});

videojs.plugin('overlaybutton', function (options) {
  if (!options) return;
  var player = this;
  player.ready(function () {
    var _div = player.controlBar.getChildById('sub_control_bar').getChildById('right_control_bar').addChild(new overlayButton(player, {
      el: videojs.createEl("div", {
        className: 'vjs-overlay-button vjs-menu-button vjs-menu-button-popup vjs-button icon-button',
        innerHTML: '<i class="icon-overlay-select fa fa-desktop"></i>',
        title: options.title
      })
    }));
  });
});

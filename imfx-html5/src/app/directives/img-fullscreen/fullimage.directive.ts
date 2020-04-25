/**
 * Created by Sergey Klimenko on 05.04.2017.
 */
import {Directive, ElementRef, Input, HostListener} from '@angular/core';
import * as $ from "jquery";
@Directive({
  selector: '[tmdfullimage]'
})

export class TmdFullImageDirective {
  constructor(private el: ElementRef) {
  }

  @HostListener('click') onClick(e) {
    if(this.el.nativeElement.nodeName == "IMG") {
      var imageSrc = this.el.nativeElement.currentSrc;
      var imageTemplate ='' +
        '<div id="full-image-container" class="full-image-container">' +
        '<div class="full-image-wrapper">' +
        '<img src="' + imageSrc + '">' +
        '</div>' +
        '</div>';

      $("app div:first").prepend(imageTemplate);
      $( "#full-image-container" ).fadeIn(200).css('display','table');
      $('#full-image-container').click(function(){
          $( "#full-image-container" ).fadeOut( 200, function() {
            $('#full-image-container').remove();
          });
      });
    } else {
      var imageSrc = this.el.nativeElement.getAttribute("data-src");
      if(imageSrc) {
        var imageTemplate ='' +
          '<div id="full-image-container" class="full-image-container">' +
          '<div class="full-image-wrapper">' +
          '<img src="' + imageSrc + '">' +
          '</div>' +
          '</div>';

        $("app div:first").prepend(imageTemplate);
        $( "#full-image-container" ).fadeIn(200).css('display','table');
        $('#full-image-container').click(function(){
          $( "#full-image-container" ).fadeOut( 200, function() {
            $('#full-image-container').remove();
          });
        });
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let x = event.keyCode;
    if (x === 27 && $('#full-image-container').length > 0) {
        $( "#full-image-container" ).fadeOut( 200, function() {
          $('#full-image-container').remove();
        });
    }
  }
}


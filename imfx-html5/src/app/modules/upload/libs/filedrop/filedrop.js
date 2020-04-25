/**
 * Created by initr on 11.09.2017.
 */


function isExistTargetProp(event) {
    let res = false;
    if(event.originalEvent && event.originalEvent.dataTransfer){
        res = true;
        console.log(event.originalEvent.dataTransfer);
        let isFiles = event.originalEvent.dataTransfer;
        $.each(isFiles.types, (k, v) => {
            if(v !== 'Files'){
                res = false;
            }
        });
    }
    return res;
}
$.fn.extend({
    filedrop: function (options) {
        var fromBrowser = false;
        var defaults = {
            callback: null
        };
        var excludeSelector = ".imfx-allow-dnd";
        options = $.extend(defaults, options);
        return this.each(function () {
            var files = [];
            var $this = $(this);

            // Stop default browser actions
            $this.unbind('dragstart dragover dragleave drop');
            $this.bind('dragover', function (event) {
                if(isExistTargetProp(event)){
                    var isFiles = event.originalEvent.target.files || event.originalEvent.dataTransfer;
                    if (isFiles) {
                        event.stopPropagation();
                        event.preventDefault();
                        if (options.onDragOver && !fromBrowser) {
                            options.onDragOver(event);
                        }
                    }
                } else {
                    return true
                }

            });

            $this.bind('dragleave', function (event) {
                if(isExistTargetProp(event)){
                    var isFiles = event.originalEvent.target.files || event.originalEvent.dataTransfer;
                    if (isFiles) {
                        event.stopPropagation();
                        event.preventDefault();
                        fromBrowser = false;
                        if (options.onDragLeave) {
                            options.onDragLeave(event);
                        }
                    }
                } else {
                    return true
                }

            });

            $this.bind('dragstart', function (event) {
                if(isExistTargetProp(event)){
                    if (options.onDragStart) {
                        options.onDragStart(event);
                    }
                } else {
                    return true
                }

                // var isFiles = event.originalEvent.target.files || event.originalEvent.dataTransfer;
                // if (isFiles) {
                //     event.stopPropagation();
                //     event.preventDefault();
                //     fromBrowser = true;
                // }
            });


            // Catch drop event
            $this.bind('drop', function (event) {
                if(!isExistTargetProp(event)){
                    return false;
                }
                var isFiles = event.originalEvent.target.files || event.originalEvent.dataTransfer;
                if (isFiles) {
                    // Stop default browser actions
                    event.stopPropagation();
                    event.preventDefault();
                    // debugger;
                    // if($(event.target).closest(excludeSelector).length == 0) {
                    // debugger;
                    if (fromBrowser) {
                        fromBrowser = false;
                        return false;
                    }

                    // Get all files that are dropped
                    files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files;
                    // console.log(files, files.length)
                    // Convert uploaded file to data URL and pass trought callback
                    if (options.callback) {
                        options.callback(files);
                        //     for (i = 0; i < files.length; i++) {
                        //         // var file = files[i];
                        //         options.callback(files[i]);
                        //         // var reader = new FileReader()
                        //         // reader.onload = function (event) {
                        //         //     console.log(file);
                        //         //     /*debugger*/
                        //         //     options.callback(event.target.result, file);
                        //         // }
                        //         // reader.readAsDataURL(file);
                        //     }
                    }
                    return false;
                    // }
                }

            });
        })
    }
});

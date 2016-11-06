// Based on the excellent article by Osvaldas Valutis
// https://css-tricks.com/drag-and-drop-file-uploading/

// resizing and cropping based on the demo by Mike Riethmuler
// http://http://tympanus.net/codrops/2014/10/30/resizing-cropping-images-canvas/


var resizeableImage = function (image_data, editCompleteMethod) {
    // Some variable and settings
    var $container,
        orig_src = new Image(),
        image_target = $('.component-image').clone().get(0),
        event_state = {},
        constrainAspectRatio = true,  // constrain by default
        min_width = 60, // Change as required
        min_height = 60,
        max_width = 600, // Change as required
        max_height =600,
        resize_canvas = document.createElement('canvas');

    init = function () {

        // When resizing, we will always use this copy of the original as the base
        image_target.src = image_data;
        orig_src.src = image_target.src;

        // get rid of old elements, in case we're starting again
        $('.component-image').remove();
        $('.resize-container').remove();
        $('.overlay').remove();

        // add the overlay
        $('.component').append($('<div class="overlay"></div>'))
        $('.overlay').append($('<div class="overlay-inner"></div>'));

        // replace the component image
        $('.component').append(image_target);
        image_target = $('.component-image');

        // Wrap the image with the container and add resize handles
        $(image_target).wrap('<div class="resize-container"></div>')
        .before('<span class="resize-handle resize-handle-nw"></span>')
        .before('<span class="resize-handle resize-handle-ne"></span>')
        .after('<span class="resize-handle resize-handle-se"></span>')
        .after('<span class="resize-handle resize-handle-sw"></span>');

        // Assign the container to a variable
        $container = $(image_target).parent('.resize-container');

        // Add events
        $container.on('mousedown touchstart', '.resize-handle', startResize);
        $container.on('mousedown touchstart', 'img', startMoving);
        $('.js-crop').on('click', crop);
        $('.js-done').on('click', function () {
            $('.component').addClass("hidden");
        });

        // show the editor
        $('.component').removeClass("hidden");

        // initial resize to fit width or height to the crop window
        var overlay = $('.overlay');
        var height = image_target.get(0).height;
        var width = image_target.get(0).width;
        var crop_height = overlay.height();
        var crop_width = overlay.width();
        if (height > crop_height || width > crop_width) {
            var heightFactor = height / crop_height;
            var widthFactor = width / crop_width;
            var scale = (heightFactor > widthFactor ? widthFactor : heightFactor);
            resizeImage(width / scale, height / scale);
        }

        // position image in center
        var borderWidth = (overlay.outerWidth() - overlay.innerWidth())/2;
        var left = overlay.offset().left  + borderWidth - ($container.width() - overlay.width())/2;
        var top = overlay.offset().top + borderWidth - ($container.height() - overlay.height()) / 2;
        $container.offset({
            'left': left,
            'top': top
        });

        crop();
    };

    startResize = function (e) {
        e.preventDefault();
        e.stopPropagation();
        saveEventState(e);
        $(document).on('mousemove touchmove', resizing);
        $(document).on('mouseup touchend', endResize);
    };

    endResize = function (e) {
        e.preventDefault();
        $(document).off('mouseup touchend', endResize);
        $(document).off('mousemove touchmove', resizing);
    };

    saveEventState = function (e) {
        // Save the initial event details and container state
        event_state.container_width = $container.width();
        event_state.container_height = $container.height();
        event_state.container_left = $container.offset().left;
        event_state.container_top = $container.offset().top;
        event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
        event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

        // This is a fix for mobile safari
        // For some reason it does not allow a direct copy of the touches property
        if (typeof e.originalEvent.touches !== 'undefined') {
            event_state.touches = [];
            $.each(e.originalEvent.touches, function (i, ob) {
                event_state.touches[i] = {};
                event_state.touches[i].clientX = 0 + ob.clientX;
                event_state.touches[i].clientY = 0 + ob.clientY;
            });
        }

        event_state.evnt = e;
    };

    resizing = function (e) {
        var mouse = {}, width, height, left, top, offset = $container.offset();
        mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
        mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

        // determine limits for the position of the image edges
        var crop_window = $('.overlay');
        var crop_edge_left = crop_window.offset().left;
        var crop_edge_right = crop_edge_left + crop_window.width();
        var crop_edge_top = crop_window.offset().top;
        var crop_edge_bottom = crop_edge_top + crop_window.height();
        var width = $container.width();
        var height = $container.height();

        // Position image differently depending on the corner dragged and constraints
        if ($(event_state.evnt.target).hasClass('resize-handle-se')) {
            mouse.x = mouse.x < crop_edge_right ? crop_edge_right : mouse.x;
            mouse.y = mouse.y < crop_edge_bottom ? crop_edge_bottom : mouse.y;
            width = mouse.x - event_state.container_left;
            height = mouse.y - event_state.container_top;
            left = event_state.container_left;
            top = event_state.container_top;
        } else if ($(event_state.evnt.target).hasClass('resize-handle-sw')) {
            mouse.x = mouse.x > crop_edge_left ? crop_edge_left : mouse.x;
            mouse.y = mouse.y < crop_edge_bottom ? crop_edge_bottom : mouse.y;
            width = event_state.container_width - (mouse.x - event_state.container_left);
            height = mouse.y - event_state.container_top;
            left = mouse.x;
            top = event_state.container_top;
        } else if ($(event_state.evnt.target).hasClass('resize-handle-nw')) {
            mouse.x = mouse.x > crop_edge_left ? crop_edge_left : mouse.x;
            mouse.y = mouse.y > crop_edge_top ? crop_edge_top : mouse.y;
            width = event_state.container_width - (mouse.x - event_state.container_left);
            height = event_state.container_height - (mouse.y - event_state.container_top);
            left = mouse.x;
            top = mouse.y;
            //if (constrainAspectRatio) {
            //    top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
            //}
        } else if ($(event_state.evnt.target).hasClass('resize-handle-ne')) {
            mouse.x = mouse.x < crop_edge_right ? crop_edge_right : mouse.x;
            mouse.y = mouse.y > crop_edge_top ? crop_edge_top : mouse.y;
            width = mouse.x - event_state.container_left;
            height = event_state.container_height - (mouse.y - event_state.container_top);
            left = event_state.container_left;
            top = mouse.y;
            //if (constrainAspectRatio) {
            //    top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
            //}
        }

        // Optionally maintain aspect ratio
        //if (constrainAspectRatio) {
        //    height = width / orig_src.width * orig_src.height;
        //}

        if (width > min_width && height > min_height && width < max_width && height < max_height) {
            // To improve performance you might limit how often resizeImage() is called
            resizeImage(width, height);
            // Without this Firefox will not re-calculate the the image dimensions until drag end
            $container.offset({ 'left': left, 'top': top });
        }
    };

    resizeImage = function (width, height) {
        resize_canvas.width = width;
        resize_canvas.height = height;
        resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);
        $(image_target).attr('src', resize_canvas.toDataURL("image/png"));
    };

    startMoving = function (e) {
        e.preventDefault();
        e.stopPropagation();
        saveEventState(e);
        $(document).on('mousemove touchmove', moving);
        $(document).on('mouseup touchend', endMoving);
    };

    endMoving = function (e) {
        e.preventDefault();
        $(document).off('mouseup touchend', endMoving);
        $(document).off('mousemove touchmove', moving);
    };

    moving = function (e) {
        var mouse = {}, touches;
        e.preventDefault();
        e.stopPropagation();

        touches = e.originalEvent.touches;

        mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft();
        mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();

        var left = mouse.x - (event_state.mouse_x - event_state.container_left);
        var top = mouse.y - (event_state.mouse_y - event_state.container_top);

        // constrain position to within the crop window
        var crop_window = $('.overlay');
        var crop_edge_left = crop_window.offset().left;
        var crop_edge_right = crop_edge_left + crop_window.width();
        var crop_edge_top = crop_window.offset().top;
        var crop_edge_bottom = crop_edge_top + crop_window.height();
        var width = $container.width();
        var height = $container.height();

        left = left < crop_edge_right - width ? crop_edge_right - width : left;
        left = left > crop_edge_left ? crop_edge_left : left;
        top = top < crop_edge_bottom - height ? crop_edge_bottom - height : top;
        top = top > crop_edge_top ? crop_edge_top : top;

        $container.offset({
            'left': left,
            'top': top
        });

        // Watch for pinch zoom gesture while moving
        if (event_state.touches && event_state.touches.length > 1 && touches.length > 1) {
            var width = event_state.container_width, height = event_state.container_height;
            var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
            a = a * a;
            var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
            b = b * b;
            var dist1 = Math.sqrt(a + b);

            a = e.originalEvent.touches[0].clientX - touches[1].clientX;
            a = a * a;
            b = e.originalEvent.touches[0].clientY - touches[1].clientY;
            b = b * b;
            var dist2 = Math.sqrt(a + b);

            var ratio = dist2 / dist1;

            width = width * ratio;
            height = height * ratio;
            // To improve performance you might limit how often resizeImage() is called
            resizeImage(width, height);
        }
    };

    

    crop = function () {
        //Find the part of the image that is inside the crop box
        var crop_canvas,
            left = $('.overlay').offset().left - $container.offset().left,
            top = $('.overlay').offset().top - $container.offset().top,
            width = $('.overlay').width(),
            height = $('.overlay').height();

        crop_canvas = document.createElement('canvas');
        crop_canvas.width = width;
        crop_canvas.height = height;

        crop_canvas.getContext('2d').drawImage(image_target.get(0), left, top, width, height, 0, 0, width, height);

        if (typeof (editCompleteMethod) === 'function') {
            editCompleteMethod(crop_canvas.toDataURL("image/png"));
        } else {
            window.open(crop_canvas.toDataURL("image/png"));
        }

    };

    init();
};

( function( $, window, document, undefined )
{
    var upload = {};
    var defaultImage = "/images/thumbnails/DogNoImage.png";

    // feature detection for drag&drop upload
    var isAdvancedUpload = function()
    {
        var div = document.createElement( 'div' );
        return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
    }();

    // attach the effect to every dropbox on the page
    $( '.dropbox' ).each( function()
    {
        var $dropbox = $(this),
            $thumbnail = $dropbox.find('.thumbnail');
            $input = $dropbox.find('input[type="file"]'),
            $editor = $('.component'),
            droppedFiles = false,
            defaultImage = $thumbnail.attr('default-image');

        showFiles = function( files )
            {

                if (files.length === 0 && defaultImage) {
                    $thumbnail[0].src = defaultImage;
                }
                else
                {
                    var f = files[0];

                    // if file is an image
                    if (f.type.match('image.*')) {
                        var reader = new FileReader();

                        upload.imageContentType=f.type;
                        reader.onload = onload(f);
                        reader.readAsDataURL(f);
                    }
                }
            };

        onload = function (theFile) {
            return function (e) {
                $thumbnail[0].src = e.target.result;
                $thumbnail[0].title = escape(theFile.name);
                
                if ($editor) edit(theFile,e);
            };
        };

        edit = function (f,ev) {
            var resizeImage = $editor.find('.component-image')[0];
            resizeImage.src = ev.target.result;
            upload.imageContentType = f.type;
            upload.imageFileName = f.Name;
            resizeableImage(ev.target.result, function (result) {
                $thumbnail[0].src = result;
                upload.imageSrc = result;
            });
        }

        $input.on( 'change', function( e )
        {
            showFiles(e.target.files);
        });

        // add hidden input elements to pass back information on the thumbnail.
        $('form').on('submit', function (e) {
            if (upload.imageSrc && upload.imageContentType) {
                upload.imageSrc = upload.imageSrc.replace('data:image/png;base64,', '');
                var thumbContentType = $("<input>")
                    .attr('type', 'hidden')
                    .attr('name', 'imageContentType').val(upload['imageContentType']);
                $('form').append($(thumbContentType));
                var thumbSource = $("<input>")
                    .attr('type', 'hidden')
                    .attr('name', 'imageSrc').val(upload['imageSrc']);
                $('form').append($(thumbSource));
            }
        });

        // drag&drop files if the feature is available
        if( isAdvancedUpload )
        {
            $dropbox
            .addClass( 'has-advanced-upload' ) // letting the CSS part to know drag&drop is supported by the browser
            .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e )
            {
                // preventing the unwanted behaviours
                e.preventDefault();
                e.stopPropagation();
            })
            .on( 'dragover dragenter', function() //
            {
                $dropbox.addClass( 'is-dragover' );
            })
            .on( 'dragleave dragend drop', function()
            {
                $dropbox.removeClass( 'is-dragover' );
            })
            .on( 'drop', function( e )
            {
                $input.prop("files", e.originalEvent.dataTransfer.files);
                showFiles(e.originalEvent.dataTransfer.files);
            });
        }

        // Firefox focus bug fix for file input
        $input
        .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
        .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
    });

})( jQuery, window, document );

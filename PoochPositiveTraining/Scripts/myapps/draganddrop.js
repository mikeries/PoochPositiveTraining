// Based on the excellent article by Osvaldas Valutis
// https://css-tricks.com/drag-and-drop-file-uploading/

( function( $, window, document, undefined )
{
    var upload = {};
    var defaultImage = "/images/thumbnails/DogNoImage.png";

    // feature detection for drag&drop upload
    var isAdvancedUpload = function()
    {
        var div = document.createElement( 'div' );
        return   'draggable' in div  ||  'ondragstart' in div && 'ondrop' in div   && 'FormData' in window && 'FileReader' in window;
    }();

    // attach the effect to every dropbox on the page
    $( '.dropbox' ).each( function()
    {
        var $dropbox = $(this),
            $thumbnail = $dropbox.find('.thumbnail');
            $input = $dropbox.find('input[type="file"]'),
            $editor = $('.img-container'),
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
//                $thumbnail[0].src = e.target.result;
                $thumbnail[0].title = escape(theFile.name);
                
                if ($editor) edit(theFile,e);
            };
        };

        edit = function (f, ev) {
            upload.imageContentType = f.type;
            upload.imageFileName = f.Name;

            $input.prop('disabled', true);
            editImage(ev.target.result, function (canvas) {
                $thumbnail[0].src = canvas.toDataURL();
                upload.imageSrc = $thumbnail[0].src;
                $input.prop('disabled', false);
            });
        };

        var editImage = function (imageData, callback) {
            var options = {
                aspectRatio: 3 / 4,
                preview: '.img-preview',
                background: false,
                modal: false
            };

            var $image = $("#image");
            $image[0].src = imageData;

            // Cropper
            $('.img-container').removeClass('hidden');
            $('.btn-crop').on('click', function () {
                var canvas = $image.cropper('getCroppedCanvas', {width:100,height:75});
                $('.img-container').addClass('hidden');
                $('.btn-crop').off('click');
                callback(canvas);
            });

            $image.cropper('destroy').cropper(options);

        };

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
